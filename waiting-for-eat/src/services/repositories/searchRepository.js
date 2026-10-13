import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseClient.js";
import { mapQuerySnapshot } from "../firebase/firestoreMappers.js";

const COMPANY_COLLECTION = "company";
const COMPANY_FIELDS = Object.freeze({
  CATEGORY: "category",
  CITY: "city",
  NAME: "name",
});

function mapCompanyResults(snapshot) {
  return mapQuerySnapshot(snapshot, "companyId").map((company) => ({
    ...company,
    status: "",
  }));
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

const findCompaniesByName = (name) => findCompanies(COMPANY_FIELDS.NAME, name);
const findCompaniesByCity = (city) => findCompanies(COMPANY_FIELDS.CITY, city);
const findCompaniesByCategory = (category) =>
  findCompanies(COMPANY_FIELDS.CATEGORY, category);

export {
  findCompaniesByCategory,
  findCompaniesByCity,
  findCompaniesByName,
  getCompanies,
};
