import { Sale } from '@prisma/client';
import { getDocument } from 'pdfjs-dist';
import { TextItem } from 'pdfjs-dist/types/src/display/api';
import { sortBy } from '../../utils/sort';
import { RPDData } from './types/rpd';
import { SalesData } from './types/sales';

const getURL = (buildingId?: number | null) => {
  return `https://xn--80az8a.xn--d1aqf.xn--p1ai/%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D1%8B/api/object/${buildingId}/document/rpd`;
};

export const getPdf = async (
  buildings: {
    id: number;
    domRfId: number | null;
    name: string;
    sales: Sale[];
  }[],
) => {
  const data: { buildingId: number; sales: SalesData[]; name: string }[] = [];
  const getNumberFromString = (text?: string | null) => {
    if (text) {
      const digits = text.replace(/\s/g, '').replace(',', '.');
      const number = Number.parseFloat(digits);
      if (number) return number;
    } else {
      console.log(text);
    }
    return null;
  };
  for await (const building of buildings) {
    const rpds: { data: RPDData[] } = await fetch(
      getURL(building.domRfId),
    ).then((res) => res.json());
    const buildingSales: SalesData[] = [];
    console.log(
      `Для дома ${building.name} загружено ${rpds.data.length} документов`,
    );
    for await (const rpd of rpds.data) {
      if (rpd && rpd.rpdIssueDttm) {
        const pattern = /^\d{2}-\d{2}-\d{4}/;
        const match = rpd.rpdIssueDttm.match(pattern);
        const date = match ? match[0] : '';
        const [dayStr, monthStr, yearStr] = date.split('-');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10) - 1;
        const year = parseInt(yearStr, 10);
        const lastSales: Sale | null | undefined = building.sales[0];
        const checkSales = () => {
          if (!lastSales && day <= 10) {
            return true;
          }
          if (lastSales && day <= 10) {
            if (year === lastSales.year && month > lastSales.month) {
              return true;
            }
            if (year > lastSales.year) {
              return true;
            }
          }
          return false;
        };
        if (checkSales()) {
          const pdfData = await fetch(rpd.rpdPdfLink).then((res) =>
            res.arrayBuffer(),
          );
          const loadingTask = getDocument({ data: pdfData });
          loadingTask.promise.then(
            async (pdf) => {
              console.log('PDF loaded');

              const numPages = pdf.numPages;

              const sale: SalesData = {
                date,
                day,
                year,
                month,
                living: {
                  amount: null,
                  area: null,
                  sum: null,
                },
                parking: {
                  amount: null,
                  area: null,
                  sum: null,
                },
                commercial: {
                  amount: null,
                  area: null,
                  sum: null,
                },
              };

              for (let i = 1; i < numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const text = textContent.items
                  .reduce((all: string[], item) => {
                    if ('str' in item) {
                      all.push(item['str'].replace(/\s/g, ''));
                    }
                    return all;
                  }, [])
                  .join(';');
                //LIVING
                const amountBuildingsMatch = text.match(
                  /илииныхобъектовнедвижимости,вотношении;которыхзаполняетсяпроектнаядекларация:[^;]*;?\s*([\d.,]+)/,
                );
                if (amountBuildingsMatch) {
                  const amountBuildingsInDocument = parseInt(
                    amountBuildingsMatch[1],
                    10,
                  );
                  if (
                    amountBuildingsInDocument &&
                    amountBuildingsInDocument !== 1
                  )
                    break;
                }

                const livingAmountMatch = text.match(
                  /19.7.1.1.1.1;;Количестводоговоров,заключенныхсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (livingAmountMatch) {
                  const number = parseInt(livingAmountMatch[1], 10);
                  sale.living.amount = number;
                }
                const livingAreaMatch = text.match(
                  /19.7.2.1.1.1;Площадьобъектов,вотношениикоторыхдоговоручастиявдолевомстроительстве;заключенсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (livingAreaMatch) {
                  console.log(livingAreaMatch[0]);
                  const number = parseFloat(
                    livingAreaMatch[1].replace(',', '.'),
                  );
                  sale.living.area = number;
                }
                const livingSumMatch = text.match(
                  /19.7.3.1.1.1;;Суммарнаяценадоговоров,заключенныхсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (livingSumMatch) {
                  const number = parseFloat(
                    livingSumMatch[1].replace(',', '.'),
                  );
                  sale.living.sum = number;
                }
                //COMMERCIAL

                const commercialAmountMatch = text.match(
                  /19.7.1.1.2.1;;Количестводоговоров,заключенныхсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (commercialAmountMatch) {
                  const number = parseFloat(commercialAmountMatch[1]);
                  sale.commercial.amount = number;
                }
                const commercialAreaMatch = text.match(
                  /19.7.2.1.2.1;Площадьобъектов,вотношениикоторыхдоговоручастиявдолевомстроительстве;заключенсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (commercialAreaMatch) {
                  const number = parseInt(
                    commercialAreaMatch[1].replace(',', '.'),
                  );
                  sale.commercial.area = number;
                }
                const commercialSumMatch = text.match(
                  /19.7.3.1.2.1;;Суммарнаяценадоговоров,заключенныхсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (commercialSumMatch) {
                  const number = parseFloat(
                    commercialSumMatch[1].replace(',', '.'),
                  );
                  sale.commercial.sum = number;
                }
                //PARKING
                const parkingAmountMatch = text.match(
                  /19.7.1.1.3.1;;Количестводоговоров,заключенныхсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (parkingAmountMatch) {
                  const number = parseFloat(parkingAmountMatch[1]);
                  sale.parking.amount = number;
                }
                const parkingAreaMatch = text.match(
                  /19.7.2.1.3.1;Площадьобъектов,вотношениикоторыхдоговоручастиявдолевомстроительстве;заключенсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (parkingAreaMatch) {
                  const number = parseFloat(
                    parkingAreaMatch[1].replace(',', '.'),
                  );
                  sale.parking.area = number;
                }
                const parkingSumMatch = text.match(
                  /19.7.3.1.3.1;;Суммарнаяценадоговоров,заключенныхсиспользованиемсчетовэскроу:[^;]*;?\s*([\d.,]+)/,
                );
                if (parkingSumMatch) {
                  const number = parseFloat(
                    parkingSumMatch[1].replace(',', '.'),
                  );
                  sale.parking.sum = number;
                }
              }
              buildingSales.push(sale);
            },
            (reason) => {
              // PDF loading error
              console.error(reason);
            },
          );
        }
      }
    }
    if (buildingSales.length) {
      data.push({
        buildingId: building.id,
        sales: sortBy(['year', 'month'], buildingSales),
        name: building.name,
      });
    }
  }
  return data;
};
