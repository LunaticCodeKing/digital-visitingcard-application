export const PERMISSIONS_CONFIG = {
    "USERS": {
        "CREATE":"admin-service::users::create",
        "READ":"admin-service::users::read",
        "UPDATE":"admin-service::users::update",
        "DELETE":"admin-service::users::delete"
    },
    "ROLES_PERMISSIONS": {
        "CREATE":"admin-service::roles-permissions::create",
        "READ":"admin-service::roles-permissions::read",
        "UPDATE":"admin-service::roles-permissions::update",
        "DELETE":"admin-service::roles-permissions::delete"
    },
    "MICROSITES": {
        "CREATE":"admin-service::microsites::create",
        "READ":"admin-service::microsites::read",
        "UPDATE":"admin-service::microsites::update",
        "DELETE":"admin-service::microsites::delete",
    },
    "AGENCY_LEADS": {
        "CREATE":"admin-service::agency-leads::create",
        "READ":"admin-service::agency-leads::read",
        "UPDATE":"admin-service::agency-leads::update",
        "DELETE":"admin-service::agency-leads::delete",
    },
    "AGENCY_PARTNERS": {
        "CREATE":"admin-service::agency-partners::create",
        "READ":"admin-service::agency-partners::read",
        "UPDATE":"admin-service::agency-partners::update",
        "DELETE":"admin-service::agency-partners::delete",
    },
    "ANCILLARY": {
        "CREATE":"admin-service::ancillary::create",
        "READ":"admin-service::ancillary::read",
        "UPDATE":"admin-service::ancillary::update",
        "DELETE":"admin-service::ancillary::delete",
    },
    "AGENCY_WALLET": {
        "CREATE":"admin-service::agency-wallet::create",
        "READ":"admin-service::agency-wallet::read",
        "VERIFY":"admin-service::agency-wallet::verify",
        "CANCEL":"admin-service::agency-wallet::cancel",
    }
}