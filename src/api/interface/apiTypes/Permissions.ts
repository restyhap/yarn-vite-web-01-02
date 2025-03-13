export interface Permissions {
    id?: string;
    roleType?: number;
    prodView?: number;
    prodCreate?: number;
    prodEdit?: number;
    prodDelete?: number;
    specView?: number;
    specCreate?: number;
    specEdit?: number;
    specDelete?: number;
    quoteView?: number;
    quoteCreate?: number;
    quoteEdit?: number;
    quoteDelete?: number;
    settingsUsers?: number;
    settingsPermissions?: number;
}
