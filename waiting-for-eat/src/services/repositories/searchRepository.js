import { collection, getDocs, query, where } from "firebase/firestore";
import { SEARCH_FIELDS } from "../../features/search/searchConstants.js";
import { createSearchResult } from "../../features/search/searchModel.js";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

const COMPANY_COLLECTION = "company";

function mapCompanyResults(snapshot) {
  return mapQuerySnapshot(snapshot, "companyId").map((company) =>
    createSearchResult(company, company.companyId),
  );
}

async function getCompanies() {
  const snapshot = await getDocs(collection(db, COMPANY_COLLECTION));
  return mapCompanyResults(snapshot);
}

async function findCompanies(field, value) {
  const companyQuery = query(
    collection(db, COMPANY_COLLECTION),
    where(field, "==", value),
  );
  const snapshot = await getDocs(companyQuery);
  return mapCompanyResults(snapshot);
}

const findCompaniesByName = (name) => findCompanies(SEARCH_FIELDS.NAME, name);
const findCompaniesByCity = (city) => findCompanies(SEARCH_FIELDS.CITY, city);
const findCompaniesByCategory = (category) =>
  findCompanies(SEARCH_FIELDS.CATEGORY, category);

export {
  findCompaniesByCategory,
  findCompaniesByCity,
  findCompaniesByName,
  getCompanies,
};
