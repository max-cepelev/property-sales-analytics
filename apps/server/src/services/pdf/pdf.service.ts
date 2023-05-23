import { Sale } from '@prisma/client';
import pdf from 'pdf-parse';
import { sortBy } from '../../utils/sort';
import { RPDData } from './types/rpd';
import { SalesData } from './types/sales';
import { FastifyInstance } from 'fastify';

export class PdfService {
  logger;
  constructor(private fastify: FastifyInstance) {
    this.logger = fastify.log;
  }

  getURL(buildingId?: number | null) {
    console.log(buildingId);
    return `https://xn--80az8a.xn--d1aqf.xn--p1ai/%D1%81%D0%B5%D1%80%D0%B2%D0%B8%D1%81%D1%8B/api/object/${buildingId}/document/rpd`;
  }

  renderPage(pageData: any) {
    //check documents https://mozilla.github.io/pdf.js/
    const render_options = {
      //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
      normalizeWhitespace: true,
      //do not attempt to combine same line TextItem's. The default value is `false`.
      disableCombineTextItems: false,
    };

    return pageData.getTextContent(render_options).then((textContent: any) => {
      let lastY,
        text = '';
      for (const item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          text += item.str.replaceAll('​', '');
        } else {
          text += ';' + item.str.replaceAll('​', '');
        }
        lastY = item.transform[5];
      }
      return text;
    });
  }

  async getPdf(
    buildings: {
      id: number;
      domRfId: number | null;
      name: string;
      sales: Sale[];
    }[],
  ) {
    const { got } = await import('got');
    const data: { buildingId: number; sales: SalesData[]; name: string }[] = [];
    // const getNumberFromString = (text?: string | null) => {
    //   if (text) {
    //     const digits = text.replace(/\s/g, '').replace(',', '.');
    //     const number = Number.parseFloat(digits);
    //     if (number) return number;
    //   } else {
    //     console.log(text);
    //   }
    //   return null;
    // };
    for await (const building of buildings) {
      const rpds: { data: RPDData[] } = await got
        .get(this.getURL(building.domRfId))
        .json();

      const buildingSales: any[] = [];

      this.logger.info(
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
            const pdfData = await got.get(rpd.rpdPdfLink).buffer();
            const loadingTask = pdf(pdfData, { pagerender: this.renderPage });
            loadingTask
              .then((pdfData) => {
                const numPages = pdfData.numpages;
                this.logger.info(`PDF loaded, pages: ${numPages}`);

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

                const text = pdfData.text;
                //LIVING
                const amountBuildingsMatch = text.match(
                  /в отношении;которых заполняется проектная декларация:[^;]*;?\s*([\d.,]+)/,
                );
                if (amountBuildingsMatch) {
                  const amountBuildingsInDocument = parseInt(
                    amountBuildingsMatch[1],
                    10,
                  );
                  this.logger.info({ amountBuildingsInDocument });
                }

                const livingAmountMatch = text.match(
                  /19.7.1.1.1.1Количестводоговоров,заключенныхсиспользованиемсчетовэскроу:\s*([\d.,]+)/g,
                );
                if (livingAmountMatch) {
                  this.logger.info({ livingAmountMatch });
                  const number = parseInt(livingAmountMatch[1], 10);
                  sale.living.amount = number;
                }
                const livingAreaMatch = text.match(
                  /19.7.2.1.1.1Площадьобъектов,вотношениикоторыхдоговоручастиявдолевомстроительствезаключенсиспользованиемсчетовэскроу:\s*([\d.,]+)/,
                );
                if (livingAreaMatch) {
                  this.logger.info(livingAreaMatch[0]);
                  const number = parseFloat(
                    livingAreaMatch[1].replace(',', '.'),
                  );
                  sale.living.area = number;
                }
                const livingSumMatch = text.match(
                  /19.7.3.1.1.1Суммарнаяценадоговоров,заключенныхсиспользованиемсчетовэскроу:\s*([\d.,]+)/,
                );
                if (livingSumMatch) {
                  const number = parseFloat(
                    livingSumMatch[1].replace(',', '.'),
                  );
                  sale.living.sum = number;
                }
                //COMMERCIAL

                const commercialAmountMatch = text.match(
                  /19.7.1.1.2.1Количестводоговоров,заключенныхсиспользованиемсчетовэскроу:\s*([\d.,]+)/,
                );
                if (commercialAmountMatch) {
                  const number = parseFloat(commercialAmountMatch[1]);
                  sale.commercial.amount = number;
                }
                const commercialAreaMatch = text.match(
                  /19.7.2.1.2.1Площадьобъектов,вотношениикоторыхдоговоручастиявдолевомстроительствезаключенсиспользованиемсчетовэскроу:\s*([\d.,]+)/,
                );
                if (commercialAreaMatch) {
                  const number = parseInt(
                    commercialAreaMatch[1].replace(',', '.'),
                  );
                  sale.commercial.area = number;
                }
                const commercialSumMatch = text.match(
                  /19.7.3.1.2.1Суммарнаяценадоговоров,заключенныхсиспользованиемсчетовэскроу:\s*([\d.,]+)/,
                );
                if (commercialSumMatch) {
                  const number = parseFloat(
                    commercialSumMatch[1].replace(',', '.'),
                  );
                  sale.commercial.sum = number;
                }
                //PARKING
                const parkingAmountMatch = text.match(
                  /19.7.1.1.3.1:\s*([\d.,]+)/,
                );
                if (parkingAmountMatch) {
                  const number = parseFloat(parkingAmountMatch[1]);
                  sale.parking.amount = number;
                }
                const parkingAreaMatch = text.match(
                  /19.7.2.1.3.1Площадьобъектов,вотношениикоторыхдоговоручастиявдолевомстроительствезаключенсиспользованиемсчетовэскроу:\s*([\d.,]+)/,
                );
                if (parkingAreaMatch) {
                  const number = parseFloat(
                    parkingAreaMatch[1].replace(',', '.'),
                  );
                  sale.parking.area = number;
                }
                const parkingSumMatch = text.match(
                  /19.7.3.1.3.1Суммарнаяценадоговоров,заключенныхсиспользованиемсчетовэскроу:\s*([\d.,]+)/,
                );
                if (parkingSumMatch) {
                  const number = parseFloat(
                    parkingSumMatch[1].replace(',', '.'),
                  );
                  sale.parking.sum = number;
                }
                this.logger.info({
                  amountBuildingsMatch,
                  livingAmountMatch,
                  livingAreaMatch,
                  livingSumMatch,
                  commercialAmountMatch,
                  commercialAreaMatch,
                  commercialSumMatch,
                });
                buildingSales.push(text);
              })
              .catch((error) => {
                this.logger.error(error);
              });
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
  }
}
