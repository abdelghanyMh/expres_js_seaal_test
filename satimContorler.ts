import { Request, Response } from "express";

import Facturesselected from "../../modals/web/facturesselected";
import Marchands from "../../modals/admin/marchands";
import { OrderStatus } from "../../interfaces/order-status.interface";
import SatimData from "../../modals/web/satimDatas";
import Transactions from "../../modals/admin/transactions";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs/promises";
import logger from "../../service/logsAdmin";
import path from "path";

dotenv.config();
/**
 * Fetch all pages of data from the API.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 */
async function get_satim_to_fatourati_transactions(
  req: Request,
  res: Response
) {
  try {
    logger.info(`\n${new Date().toLocaleString()} : Retrieved all transaction records that occurred between the Satim and Fatourati APIs 
    `);

    let page = 1;
    const size = 200; // Number of records on one page (maximum value is 200).
    let fetchMore = true; // Variable to stop the fetching loop
    const transactionStatus = "APPROVED,DECLINED,DEPOSITED,REVERSED";
    const transactionStatusTarget = "DEPOSITED";
    let allData: OrderStatus[] = [];
    let depositedTransitions: string[] = [];

    const startDate = req.body.dateDebut; // Date and time of the report period beginning. Format is YYYYMMDDTHHmmss.
    /*
     * If the provided end date is in the future, it returns the current date and time.
     * Otherwise, it returns the provided end date.
     */
    let endDate = getValidEndDate(req.body.dateFin); // Date and time of the report period end. Format is YYYYMMDDTHHmmss

    const merchantsResponse = await Marchands.findByPk(1);
    if (!merchantsResponse) {
      logger.error("merchants not found:");
      return res.status(500).json({ error: "merchants not found" });
    }
    const merchants = merchantsResponse?.dataValues.marchand_designation;

    const satimData = await SatimData.findByPk(2);
    if (!satimData) {
      logger.error("SatimData not found:");
      return res.status(500).json({ error: "SatimData not found" });
    }
    const { url_json, username, password } = satimData?.dataValues;

    const filesavepathAllTransactions = "/mnt/Archive-transation";
    const fileSavePath = "/mnt/X7"; // X7 path
    // const filesavepathAllTransactions =
    //   "\\\\KBA-FCH-IN-T01\\SharedFolders$\\DSI (Direction des Systemes d'information)\\02-Applicatif\\rapports_fatourati_export_btns";
    // const fileSavePath = "\\\\kba-x7-ap-p01\\FICHIERS_TST\\IMPORT"; // X7 path

    const fileNameAllTransactions = `SATIM_SEAAL_All_Transaction_${formatDateToYYYYDDMM(
      Date.now()
    )}.txt`;
    const fileName = `SATIM_SEAAL_${formatDateToYYYYDDMM(Date.now())}.txt`;

    // Loop to fetch all pages until no more data is available
    // no more data is available means that after we call satim api with next page number
    // the "orderStatuses": [], empty
    while (fetchMore) {
      try {
        // Make a request to the SATIM API with the current page number and 200 items per page
        const response = await axios.get(url_json, {
          params: {
            userName: username,
            password: password,
            transactionStates: transactionStatus,
            merchants: merchants,
            from: startDate,
            to: endDate,
            size,
            page,
          },
          paramsSerializer: customParamsSerializer,

          timeout: 60000, // Increase the timeout value (in milliseconds)
        });
        const data = response.data;

        // Check for errorCode and handle accordingly
        if (data.errorCode !== 0) {
          logger.error(`Error fetching data from satim API: ${data.errorCode}`);
          fetchMore = false;
          return res
            .status(500)
            .json({ error: `Satim API Error: ${data.errorCode}` });
        }
        // If orderStatuses are returned, add them to the allData array and increment the page number
        if (data.orderStatuses && data.orderStatuses.length > 0) {
          allData = allData.concat(data.orderStatuses);
          page++;
        } else {
          // If no data is returned, set fetchMore to false to exit the loop
          fetchMore = false;
        }
      } catch (error) {
        // Log the error and exit the loop
        logger.error(`Error fetching data from page ${page}:`, error);
        fetchMore = false;
        return res.status(500).json({
          error: `Error fetching data from page ${page} \n error message ${error}`,
        });
      }
    }

    logger.info(
      `\n${new Date().toLocaleString()} Successfully fetched data from Satim API, data length: ${
        allData.length
      }`
    );
    logger.info(
      `\n${new Date().toLocaleString()} Starting data formatting process`
    );

    //! start formatting the satim API response
    // TODO put the transactions with dipposed on the status on the a seperated file the other put them on another file
    // TODO chqngfe the file number
    const allTransitionsArray: string[] = [];
    await Promise.all(
      allData.map(async (transaction) => {
        const datePaiment = formatDateToYYYYDDMM(transaction.date);
        let numeroAutorisationSatim = transaction.cardAuthInfo?.approvalCode;
        // Ensure numeroAutorisationSatim is 12 characters long
        numeroAutorisationSatim = numeroAutorisationSatim?.padStart(12, "0");
        // get transaction for the sql db
        //! dont use this in case the attributes arrays updated and the Index of orderId is not 0
        const orderId =
          transaction.attributes.find((attr) => attr.name === "mdOrder")
            ?.value || "satim Api didn't sent OrderId ";

        const transactionDb = await Transactions.findOne({
          where: {
            orderId: orderId,
          },
        });

        // This code snippet handles the case when a transaction is not found in the database
        // based on the provided orderId. It returns an appropriate error response to the client.
        if (!transactionDb) {
          console.log(`Transaction not found for order ID: ${orderId}.`);
          // return res.status(500).json({
          //   message: `Transaction not found for order ID: ${orderId}.`,
          // });
          return;
        }
        let { transaction_id, code_client } = transactionDb.dataValues;
        const factures = await Facturesselected.findAll({
          where: {
            codeClient: code_client, // TODO is it okay if they dont have the same name ?
            id_transaction: transaction_id,
          },
        });
        // Ensure numeroFacture is 16 characters long
        // Ensure code_client is 8 characters long
        code_client = code_client.padStart(8, "0");
        factures.forEach((facture) => {
          let numeroFacture = facture.dataValues.numero_fac;
          numeroFacture = numeroFacture.padStart(16, "0");
          let soldeFacture = facture.dataValues.solde
            .toString()
            .padStart(11, "0");
          if (
            transaction.paymentAmountInfo.paymentState ===
            transactionStatusTarget
          ) {
            depositedTransitions.push(
              `${code_client}${code_client}${soldeFacture}C${datePaiment}TT${numeroAutorisationSatim}${numeroFacture}`
            );
          }
          allTransitionsArray.push(
            `${code_client}${code_client}${soldeFacture}C${datePaiment}TT${numeroAutorisationSatim}${numeroFacture}`
          );
        });
      })
    );

    // Define the file path where you want to save the JSON file with DEPOSITED TRANSACTIONS
    const filePath = path.join(fileSavePath, fileName);
    const filepathAllTransactions = path.join(
      filesavepathAllTransactions,
      fileNameAllTransactions
    );

    await fs.writeFile(
      filepathAllTransactions,
      processArray(allTransitionsArray)
    );
    await fs.writeFile(filePath, processArray(depositedTransitions));

    logger.info(
      `JSON files saved to ${filepathAllTransactions} and ${filePath}`
    );
    return res
      .status(200)
      .json({ message: "Files generated and saved successfully" });
  } catch (error) {
    logger.error("Unexpected error:", error);
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
  /**
   * Formats a Unix timestamp (in milliseconds) to the "yyyyddmm" format.
   * @param unixTimestamp The Unix timestamp (in milliseconds) to be formatted.
   * @returns The formatted date string in the "yyyyddmm" format.
   */
  function formatDateToYYYYDDMM(unixTimestamp: number): string {
    const date = new Date(unixTimestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}${month}${day}`;
    return formattedDate;
  }
  function getCurrentDate() {
    const date_enc = new Date();
    const year_enc = date_enc.getFullYear();
    const month_enc = String(date_enc.getMonth() + 1).padStart(2, "0");
    const day_enc = String(date_enc.getDate()).padStart(2, "0");
    const hours_enc = String(date_enc.getHours()).padStart(2, "0");
    const minutes_enc = String(date_enc.getMinutes()).padStart(2, "0");
    const seconds_enc = String(date_enc.getSeconds()).padStart(2, "0");
    // Constructing the desired format
    let formattedCurrentDate = `${year_enc}/${month_enc}/${day_enc} ${hours_enc}:${minutes_enc}:${seconds_enc}`;
    return formattedCurrentDate;
  }
  function getValidEndDate(endDate: any) {
    const currentDate = getCurrentDate();
    // Check if the endDate is in the future
    if (endDate > currentDate) {
      return currentDate;
    }
    return endDate;
  }
}

const customParamsSerializer = (
  params: Record<string, string | number | boolean>
): string => {
  // Use Object.entries() to iterate over the key-value pairs in the params object
  const serializedParams = Object.entries(params)
    .map(([key, val]) => {
      // Use encodeURIComponent() to URL-encode the key and value
      // Replace the space character with %20
      // Replace the forward slash with %2F
      key = encodeURIComponent(key)
        .replace(/%20/g, "%20")
        .replace(/%2F/g, "%2F");
      // Ensure val is a string, number, or boolean before encoding
      if (
        typeof val === "string" ||
        typeof val === "number" ||
        typeof val === "boolean"
      ) {
        val = encodeURIComponent(String(val))
          .replace(/%20/g, "%20")
          .replace(/%2F/g, "%2F");
      } else {
        throw new Error("Invalid parameter value type");
      }
      // Replace space in date with %20
      if (
        typeof val === "string" &&
        val.match(/^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/)
      ) {
        val = val.replace(/ /g, "%20");
      }
      // Return the serialized key-value pair
      return `${key}=${val}`;
    })
    .join("&");

  return serializedParams;
};
function processArray(inputArray: any): string {
  return inputArray
    .filter(
      (item: any): item is string => typeof item === "string" && item.length > 0
    )
    .join("\n");
}

export { get_satim_to_fatourati_transactions };
