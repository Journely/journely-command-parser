declare const _default: {
    salesforce: {
        name: string;
        alias: string;
        appLogo: string;
        description: string;
        appUrl: string;
        objects: {
            Opportunity: {
                fields: {
                    object: string;
                    label: string;
                    name: string;
                    type: string;
                }[];
            };
            Contact: {
                fields: never[];
            };
        };
    };
    zoom: {
        name: string;
        alias: string;
        appLogo: string;
        description: string;
        appUrl: string;
        objects: {
            meetings: {
                fields: never[];
            };
        };
    };
    gcal: {
        name: string;
        alias: string;
        appLogo: string;
        description: string;
        appUrl: string;
        objects: {
            events: {
                fields: never[];
            };
        };
    };
};
export default _default;
