/* eslint-disable */
import type { Prisma, Region, City, District, Group, Developer, Complex, Building, Property, Sale, Offer, Log, User, Lead } from "@prisma/client";
export default interface PrismaTypes {
    Region: {
        Name: "Region";
        Shape: Region;
        Include: Prisma.RegionInclude;
        Select: Prisma.RegionSelect;
        OrderBy: Prisma.RegionOrderByWithRelationInput;
        WhereUnique: Prisma.RegionWhereUniqueInput;
        Where: Prisma.RegionWhereInput;
        Create: {};
        Update: {};
        RelationName: "cities" | "groups";
        ListRelations: "cities" | "groups";
        Relations: {
            cities: {
                Shape: City[];
                Name: "City";
            };
            groups: {
                Shape: Group[];
                Name: "Group";
            };
        };
    };
    City: {
        Name: "City";
        Shape: City;
        Include: Prisma.CityInclude;
        Select: Prisma.CitySelect;
        OrderBy: Prisma.CityOrderByWithRelationInput;
        WhereUnique: Prisma.CityWhereUniqueInput;
        Where: Prisma.CityWhereInput;
        Create: {};
        Update: {};
        RelationName: "region" | "districts" | "complexes" | "buildings";
        ListRelations: "districts" | "complexes" | "buildings";
        Relations: {
            region: {
                Shape: Region;
                Name: "Region";
            };
            districts: {
                Shape: District[];
                Name: "District";
            };
            complexes: {
                Shape: Complex[];
                Name: "Complex";
            };
            buildings: {
                Shape: Building[];
                Name: "Building";
            };
        };
    };
    District: {
        Name: "District";
        Shape: District;
        Include: Prisma.DistrictInclude;
        Select: Prisma.DistrictSelect;
        OrderBy: Prisma.DistrictOrderByWithRelationInput;
        WhereUnique: Prisma.DistrictWhereUniqueInput;
        Where: Prisma.DistrictWhereInput;
        Create: {};
        Update: {};
        RelationName: "city" | "complexes" | "buildings";
        ListRelations: "complexes" | "buildings";
        Relations: {
            city: {
                Shape: City;
                Name: "City";
            };
            complexes: {
                Shape: Complex[];
                Name: "Complex";
            };
            buildings: {
                Shape: Building[];
                Name: "Building";
            };
        };
    };
    Group: {
        Name: "Group";
        Shape: Group;
        Include: Prisma.GroupInclude;
        Select: Prisma.GroupSelect;
        OrderBy: Prisma.GroupOrderByWithRelationInput;
        WhereUnique: Prisma.GroupWhereUniqueInput;
        Where: Prisma.GroupWhereInput;
        Create: {};
        Update: {};
        RelationName: "regions" | "buildings" | "developers" | "complexes";
        ListRelations: "regions" | "buildings" | "developers" | "complexes";
        Relations: {
            regions: {
                Shape: Region[];
                Name: "Region";
            };
            buildings: {
                Shape: Building[];
                Name: "Building";
            };
            developers: {
                Shape: Developer[];
                Name: "Developer";
            };
            complexes: {
                Shape: Complex[];
                Name: "Complex";
            };
        };
    };
    Developer: {
        Name: "Developer";
        Shape: Developer;
        Include: Prisma.DeveloperInclude;
        Select: Prisma.DeveloperSelect;
        OrderBy: Prisma.DeveloperOrderByWithRelationInput;
        WhereUnique: Prisma.DeveloperWhereUniqueInput;
        Where: Prisma.DeveloperWhereInput;
        Create: {};
        Update: {};
        RelationName: "group" | "buildings";
        ListRelations: "buildings";
        Relations: {
            group: {
                Shape: Group;
                Name: "Group";
            };
            buildings: {
                Shape: Building[];
                Name: "Building";
            };
        };
    };
    Complex: {
        Name: "Complex";
        Shape: Complex;
        Include: Prisma.ComplexInclude;
        Select: Prisma.ComplexSelect;
        OrderBy: Prisma.ComplexOrderByWithRelationInput;
        WhereUnique: Prisma.ComplexWhereUniqueInput;
        Where: Prisma.ComplexWhereInput;
        Create: {};
        Update: {};
        RelationName: "group" | "city" | "district" | "buildings";
        ListRelations: "buildings";
        Relations: {
            group: {
                Shape: Group;
                Name: "Group";
            };
            city: {
                Shape: City;
                Name: "City";
            };
            district: {
                Shape: District;
                Name: "District";
            };
            buildings: {
                Shape: Building[];
                Name: "Building";
            };
        };
    };
    Building: {
        Name: "Building";
        Shape: Building;
        Include: Prisma.BuildingInclude;
        Select: Prisma.BuildingSelect;
        OrderBy: Prisma.BuildingOrderByWithRelationInput;
        WhereUnique: Prisma.BuildingWhereUniqueInput;
        Where: Prisma.BuildingWhereInput;
        Create: {};
        Update: {};
        RelationName: "city" | "district" | "developer" | "group" | "complex" | "sales" | "properties";
        ListRelations: "sales" | "properties";
        Relations: {
            city: {
                Shape: City;
                Name: "City";
            };
            district: {
                Shape: District;
                Name: "District";
            };
            developer: {
                Shape: Developer;
                Name: "Developer";
            };
            group: {
                Shape: Group;
                Name: "Group";
            };
            complex: {
                Shape: Complex;
                Name: "Complex";
            };
            sales: {
                Shape: Sale[];
                Name: "Sale";
            };
            properties: {
                Shape: Property[];
                Name: "Property";
            };
        };
    };
    Property: {
        Name: "Property";
        Shape: Property;
        Include: Prisma.PropertyInclude;
        Select: Prisma.PropertySelect;
        OrderBy: Prisma.PropertyOrderByWithRelationInput;
        WhereUnique: Prisma.PropertyWhereUniqueInput;
        Where: Prisma.PropertyWhereInput;
        Create: {};
        Update: {};
        RelationName: "building";
        ListRelations: never;
        Relations: {
            building: {
                Shape: Building;
                Name: "Building";
            };
        };
    };
    Sale: {
        Name: "Sale";
        Shape: Sale;
        Include: Prisma.SaleInclude;
        Select: Prisma.SaleSelect;
        OrderBy: Prisma.SaleOrderByWithRelationInput;
        WhereUnique: Prisma.SaleWhereUniqueInput;
        Where: Prisma.SaleWhereInput;
        Create: {};
        Update: {};
        RelationName: "building";
        ListRelations: never;
        Relations: {
            building: {
                Shape: Building;
                Name: "Building";
            };
        };
    };
    Offer: {
        Name: "Offer";
        Shape: Offer;
        Include: never;
        Select: Prisma.OfferSelect;
        OrderBy: Prisma.OfferOrderByWithRelationInput;
        WhereUnique: Prisma.OfferWhereUniqueInput;
        Where: Prisma.OfferWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
    Log: {
        Name: "Log";
        Shape: Log;
        Include: Prisma.LogInclude;
        Select: Prisma.LogSelect;
        OrderBy: Prisma.LogOrderByWithRelationInput;
        WhereUnique: Prisma.LogWhereUniqueInput;
        Where: Prisma.LogWhereInput;
        Create: {};
        Update: {};
        RelationName: "user";
        ListRelations: never;
        Relations: {
            user: {
                Shape: User;
                Name: "User";
            };
        };
    };
    User: {
        Name: "User";
        Shape: User;
        Include: Prisma.UserInclude;
        Select: Prisma.UserSelect;
        OrderBy: Prisma.UserOrderByWithRelationInput;
        WhereUnique: Prisma.UserWhereUniqueInput;
        Where: Prisma.UserWhereInput;
        Create: {};
        Update: {};
        RelationName: "logs";
        ListRelations: "logs";
        Relations: {
            logs: {
                Shape: Log[];
                Name: "Log";
            };
        };
    };
    Lead: {
        Name: "Lead";
        Shape: Lead;
        Include: never;
        Select: Prisma.LeadSelect;
        OrderBy: Prisma.LeadOrderByWithRelationInput;
        WhereUnique: Prisma.LeadWhereUniqueInput;
        Where: Prisma.LeadWhereInput;
        Create: {};
        Update: {};
        RelationName: never;
        ListRelations: never;
        Relations: {};
    };
}