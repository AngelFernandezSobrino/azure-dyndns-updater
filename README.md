# azure-dyndns-updater

Automated record updater for Azure DNS zones. It creates a record for the current public IP address of the machine it is running on.

## Usage

### Prerequisites

-   Node.js
-   Node Package Manager (npm)
-   Dependencies: `npm install`

### Configuration

-   Create a .env file in the root directory of the project
-   Add the following environment variables to the .env file:

    - SUBSCRIPTION_ID
    - RESOURCE_GROUP_NAME
    - ZONE_NAME
    - RELATIVE_RECORD_SET_NAME

-   Run `npm start` to run the script and check the behavior

### Deployment

-   Create a new task in your device's Task Scheduler, either Linux Cron or Windows Task Scheduler, for example.
-   Set the task to run every 5 minutes or so.
-   Set the task to run the script with `npm start` command or `node index.js` command on the root directory of the project.

## License

MIT

## Author

-   [Ángel Fernández Sobrino](https://github.com/AngelFernandezSobrino)

## Other information

-   [Azure SDK for Node.js](https://learn.microsoft.com/en-us/azure/developer/javascript/core/use-azure-sdk)
-   [Azure SDK for Node.js - DNS](https://docs.microsoft.com/en-us/javascript/api/@azure/arm-dns/?view=azure-node-latest)
-   [Azure SDK for Node.js - DNS - Record Sets](https://docs.microsoft.com/en-us/javascript/api/@azure/arm-dns/recordsets?view=azure-node-latest)
-   [Azure SDK for Node.js - DNS - Record Sets - CreateOrUpdate](https://docs.microsoft.com/en-us/javascript/api/@azure/arm-dns/recordsets?view=azure-node-latest#CreateOrUpdate_RecordSet__string__string__string__string__string__string__RecordSet__RequestOptionsBase__OperationOptionsBase__)
-   [nslookup](https://www.nslookup.io/)