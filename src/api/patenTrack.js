import axios from 'axios';
import {base_api_url, base_new_api_url} from '../config/config';

const getCookie = (name)=> {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const getHeader = () => {
  let token = localStorage.getItem('admin_token');
  if(token == null) {
    token = getCookie('admin_token');
  }
  return {
    headers: {
      'x-auth-token': token
    }
  };  
};

const getMultiFormUrlHeader = () => {
  let token = localStorage.getItem('admin_token');
  if(token === null) {
    token = getCookie('admin_token');
  }
  return {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'multipart/form-data'
    }
  }; 
};

const getFormUrlHeader = () => {
  let token = localStorage.getItem('admin_token');
  if(token === null) {
    token = getCookie('admin_token');
  }
  return {
    headers: {
      'x-auth-token': token,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }; 
};
var CancelToken = axios.CancelToken;

var cancel, cancelCompanyData, cancelButtonData, cancelUsersData, cancelCitingData;

class PatenTrackApi {

  static runQuery(companyName, queryNo) {
    return axios.get(`${base_new_api_url}/admin/customers/run_query/${companyName}/${queryNo}`, getHeader()); 
  }

  static getProfile() {
    return axios.get(`${base_new_api_url}/profile`, getHeader()); 
  }
  
  static getAdminUsers() {
    return axios.get(`${base_new_api_url}/admin/users`, getHeader());
  }

  static addAdminUser( user ) {
    return axios.post(`${base_new_api_url}/admin/users`, user, getFormUrlHeader());   
  }

  static updateAdminUser( user, ID ) {
    return axios.put(`${base_new_api_url}/admin/users/${ID}`, user, getFormUrlHeader());   
  }
  
  static deleteAdminUser( ID ) {
    return axios.delete(`${base_new_api_url}/admin/users/${ID}`, getHeader());  
  }

  static getClients() {    
    return axios.get(`${base_new_api_url}/admin/customers`, getHeader()); 
  }

  static getPortfolioCompanies(clientID) {
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/companies`, getHeader()); 
  }

  static getEntitiesList(clientID, portfolios, type){
    const url = portfolios.length > 0 ? `${base_new_api_url}/admin/customers/customers/${clientID}/${JSON.stringify(portfolios)}/${type}` :`${base_new_api_url}/admin/customers/customers/${clientID}/${type}`;
    return axios.get(url, getHeader()); 
  }

  static getEntityAsset(entityID){ 
    return axios.get(`${base_new_api_url}/admin/company/assets/${entityID}`, getHeader()); 
  }

  static getTransactionList(clientID, portfolios){
    const url = portfolios.length > 0 ? `${base_new_api_url}/admin/company/transactions/${clientID}/${JSON.stringify(portfolios)}` :`${base_new_api_url}/admin/company/transactions/${clientID}`;
    return axios.get(url, getHeader());  
  }

  static getAssignmentList(clientID, portfolios){
    const url = portfolios.length > 0 ? `${base_new_api_url}/admin/company/assignments/${clientID}/?portfolios=${JSON.stringify(portfolios)}` :`${base_new_api_url}/admin/company/assignments/${clientID}`;
    return axios.get(url, getHeader());  
  }

  static getCitedAssigneesList(clientID, portfolios, sortBy, sortDirection, rowsPerPage, currentPage){
    if (cancelCitingData !== undefined) {
      cancelCitingData();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelCitingData = c;
    })
    const url = portfolios.length > 0 ? `${base_new_api_url}/admin/company/cited/${clientID}/?portfolios=${JSON.stringify(portfolios)}&sort_by=${sortBy}&sort_direction=${sortDirection}&rows_per_page=${rowsPerPage}&current_page=${currentPage}` :`${base_new_api_url}/admin/company/cited/${clientID}?sort_by=${sortBy}&sort_direction=${sortDirection}&rows_per_page=${rowsPerPage}&current_page=${currentPage}`;
    return axios.get(url,header);  
  }
   

  static updateAssigneeQuery(formData){
    const url = `${base_new_api_url}/admin/company/assignees/query_name`;
    return axios.put(url, formData, getFormUrlHeader()); 
  }

  static updateAssigneesLogos(formData){
    const url = `${base_new_api_url}/admin/company/assignees/logos`;
    return axios.put(url, formData, getFormUrlHeader()); 
  }

  static healthReport(formData, clientID){
    return axios.post(`${base_new_api_url}/admin/company/report_dashboard/${clientID}`, formData, getFormUrlHeader());  
  }

  static getRawAssignmentList(clientID, portfolios){
    const url = `${base_new_api_url}/admin/company/raw/assignments/${clientID}/?portfolios=${JSON.stringify(portfolios)}`;
    return axios.get(url, getHeader());  
  }
  
  static getKeywordList(){
    return axios.get(`${base_new_api_url}/admin/keywords`, getHeader());  
  } 

  static postKeyword(formData){
    return axios.post(`${base_new_api_url}/admin/keywords`, formData, getFormUrlHeader());  
  }

  static updateKeyword(formData, keywordID){
    return axios.put(`${base_new_api_url}/admin/keywords/${keywordID}`, formData, getFormUrlHeader());  
  }

  static deleteKeyword(keywordID){
    return axios.delete(`${base_new_api_url}/admin/keywords/${keywordID}`, getHeader());  
  }

  static getSuperKeywordList(){
    return axios.get(`${base_new_api_url}/admin/super_keywords`, getHeader());  
  } 

  static postSuperKeyword(formData){
    return axios.post(`${base_new_api_url}/admin/super_keywords`, formData, getFormUrlHeader());  
  }

  static updateSuperKeyword(formData, keywordID){
    return axios.put(`${base_new_api_url}/admin/super_keywords/${keywordID}`, formData, getFormUrlHeader());  
  }

  static deleteSuperKeyword(keywordID){
    return axios.delete(`${base_new_api_url}/admin/super_keywords/${keywordID}`, getHeader());  
  }

  static getStateList(){
    return axios.get(`${base_new_api_url}/admin/state`, getHeader());  
  } 

  static postState(formData){
    return axios.post(`${base_new_api_url}/admin/state`, formData, getFormUrlHeader());  
  }

  static updateState(formData, keywordID){
    return axios.put(`${base_new_api_url}/admin/state/${keywordID}`, formData, getFormUrlHeader());  
  }

  static deleteState(keywordID){
    return axios.delete(`${base_new_api_url}/admin/state/${keywordID}`, getHeader());  
  }

  static addBulkCompaniesToAccount(accountID, formData){
    return axios.post(`${base_new_api_url}/admin/company/${accountID}/add_bulk_companies`, formData, getFormUrlHeader());  
  }

  static updateCompanySelection(formData, accountID) {    
    return axios.put(`${base_new_api_url}/admin/company/${accountID}/company_selection`, formData, getFormUrlHeader());  
  }

  static getLawFirmList(clientID, portfolios){
    const url = clientID > 0 ? `${base_new_api_url}/admin/company/law_firms/${clientID}?portfolios=${JSON.stringify(portfolios)}` : `${base_new_api_url}/admin/company/law_firms`;
    return axios.get(url, getHeader());  
  }

  static findLawfirmsCompaniesByID(companyID){
    const url = `${base_new_api_url}/admin/company/${companyID}/law_firms`;
    return axios.get(url, getHeader());  
  } 

  static getLawyerList(clientID, portfolios){
    const url = clientID > 0 ? `${base_new_api_url}/admin/company/lawyers/${clientID}?portfolios=${JSON.stringify(portfolios)}` : `${base_new_api_url}/admin/company/lawyers`;
    return axios.get(url, getHeader());  
  }

  static getClientAssetsList(clientID, portfolios, direction){
    const url = portfolios.length > 0 ? `${base_new_api_url}/admin/customers/${clientID}/patents?representativeID=${JSON.stringify(portfolios)}&direction=${direction}` :`${base_new_api_url}/admin/customers/${clientID}/patents?direction=${direction}`; 
    return axios.get(url, getHeader()); 
  }

  static cleanAddress(clientID, portfolios, formData){
    const url = portfolios.length > 0 ? `${base_new_api_url}/admin/company/raw/assignments/${clientID}/?portfolios=${JSON.stringify(portfolios)}` :`${base_new_api_url}/admin/company/raw/assignments/${clientID}`;
    return axios.put(url, formData, getFormUrlHeader());
  }

  static updateNormalizeEntites (formData){
    return axios.put(`${base_new_api_url}/admin/company/search/all`, formData, getFormUrlHeader());
  } 

  static updateNormalizeLawFirms (formData){
    return axios.put(`${base_new_api_url}/admin/company/law_firms`, formData, getFormUrlHeader());
  } 

  static updateNormalizeLawyers (formData){
    return axios.put(`${base_new_api_url}/admin/company/lawyers`, formData, getFormUrlHeader());
  }

  static transactionUpdate (formData, clientID){
    return axios.put(`${base_new_api_url}/admin/company/transactions/${clientID}`, formData, getFormUrlHeader());
  }

  static assignmentUpdate (formData){
    return axios.put(`${base_new_api_url}/admin/company/assignments`, formData, getFormUrlHeader());
  }

  static updateClientLogo (formData, clientID){
    return axios.put(`${base_new_api_url}/admin/customers/${clientID}/logo`, formData, getMultiFormUrlHeader());
  }

  static getValidateCounter(companyName) { 
    return axios.get(`${base_new_api_url}/validity_counter/${companyName}`, getHeader());
  } 

  static getCustomers(type) {
    return axios.get(`${base_new_api_url}/customers/${type}`, getHeader());
  }

  static getCustomersParties(parentCompany, tabId) {
    return axios.get(`${base_new_api_url}/customers/${parentCompany}/parties/${tabId}`, getHeader());
  }

  static getCustomersNameCollections(name, parentCompany, tabId) {
    return axios.get(`${base_new_api_url}/customers/${parentCompany}/${name}/collections/${tabId}`, getHeader());
  } 

  static getCustomerRFIDAssets(rfID) {
    return axios.get(`${base_new_api_url}/customers/${rfID}/assets`, getHeader());
  } 

  static getAssetsCount(companyName) {
    return axios.get(`${base_new_api_url}/updates/${companyName}`, getHeader());
  }

  static getTransactions(companyName) {
    return axios.get(`${base_new_api_url}/transactions/${companyName}`, getHeader());
  }

  static getRecordItems(type, option) {
    return axios.get(`${base_new_api_url}/activities/${type}/${option}`, getHeader());
  }

  static getErrorItems(type, companyName, queryString) {
    let URL = `${base_new_api_url}/errors/${type}/${companyName}`;
    if(typeof queryString !== 'undefined') { 
      URL += '?'+queryString;
    }
    return axios.get(URL, getHeader());
  }

  static getLawyers() {
    return axios.get(`${base_new_api_url}/professionals`, getHeader());
  }
 
  static getDocuments() {
    return axios.get(`${base_new_api_url}/documents`, getHeader());
  }

  static getCompanies() {
    return axios.get(`${base_new_api_url}/companies`, getHeader());
  }

  static deleteCompany(clientID, companiesList ) {
    return axios.delete(`${base_new_api_url}/admin/customers/${clientID}/companies?companies=${JSON.stringify(companiesList)}`, getHeader());
  }

  static getRecentTransactions() {
    return axios.get(`${base_new_api_url}/admin/company/recent_transactions`, getHeader());
  }

  static getSubCompanies( name ) {
    return axios.get(`${base_api_url}/companies/subcompanies/${name}`, getHeader());
  }

  static deleteSameCompany( companiesList ) {
    return axios.delete(`${base_new_api_url}/companies/subcompanies/${companiesList}`, getHeader());
  }

  static getUsers(clientID) {
    if (cancelUsersData !== undefined) {
      cancelUsersData();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelUsersData = c;
    })
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/users`, header);
  }

  static getCharts(option) {
    return axios.get(`${base_api_url}/charts/${option}`, getHeader());
  }

  static getChartsOne(option) {
    return axios.get(`${base_new_api_url}/charts/${option}`, getHeader());
  }

  static getTimeLine(tabId) {
    return axios.get(`${base_new_api_url}/timeline/${parseInt(tabId)}`, getHeader());
  }

  static getFilterTimeLine(parent, label, depth, tabId) {
    return axios.get(`${base_new_api_url}/timeline/${parent}/${label}/${depth}/${tabId}`, getHeader());
  }

  static getTimelineFilterWithDate(groupId, startDate, endDate, scroll) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    console.log("getTimelineFilterWithDateF", header, cancel);
    return axios.get(`${base_new_api_url}/timeline/filter/search/${groupId}/${startDate}/${endDate}/${scroll}`, header);   
  } 
 
  static getMessages(type) {
    return axios.get(`${base_api_url}/messages/${type}`, getHeader());
  }

  static getAlerts(type) {
    return axios.get(`${base_api_url}/alerts/${type}`, getHeader());
  }

  static getComments(type, value) {
    return axios.get(`${base_new_api_url}/activities/comments/${type}/${value}`, getHeader());
  }

  static getAssetsByPatentNumber(patentNumber, flag) { 
    return axios.get(`${base_new_api_url}/admin/patents/${patentNumber}?flag=${flag}`, getHeader());
  } 

  static getButtonsStatus(ID) { 
    if (cancelButtonData !== undefined) {
      cancelButtonData();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelButtonData = c;
    })
    return axios.get(`${base_new_api_url}/admin/customers/${ID}/buttons`, header);
  }

  static updateButtonStatus(ID, data) { 
    return axios.put(`${base_new_api_url}/admin/customers/${ID}/buttons`, data, getFormUrlHeader());
  }

  static getCompanyData(ID) { 
    if (cancelCompanyData !== undefined) {
      cancelCompanyData();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancelCompanyData = c;
    })
    return axios.get(`${base_new_api_url}/admin/customers/${ID}`,header);
  }

  static getOriginalCompanyList(companyID) { 
    return axios.get(`${base_new_api_url}/admin/customers/company/${companyID}`, getHeader());
  }

  static getCollectionIllustration(rfID) {
    return axios.get(`${base_new_api_url}/collections/${rfID}/illustration`, getHeader());
  }

  static geteAssetsOutsourceByPatentNumber(type, patentNumber) {
    return axios.get(`${base_new_api_url}/assets/${patentNumber}/${type}/outsource`, getHeader());
  }

  static getSiteLogo() {
    return axios.get(`${base_api_url}/site_logo`, getHeader());
  }

  static findRecord(ID) {
    return axios.get(`${base_new_api_url}/activities/${ID}`, getHeader());
  }

  static postRecordItems( data, type ) {
    return axios.post(`${base_new_api_url}/activities/${type}`, data, getMultiFormUrlHeader());
  }

  static completeRecord( data, type ) {
    return axios.put(`${base_new_api_url}/activities/${type}`, data, getMultiFormUrlHeader());
  }

  static updateComment( method, data, type, value ) {
    if(method === "PUT") {
      return axios.put(`${base_api_url}/comments/${type}/${value}`, data, getFormUrlHeader());
    } else {
      return axios.post(`${base_api_url}/comments/${type}/${value}`, data, getFormUrlHeader());
    }    
  }

  static updateUser( user, ID, clientID ) {
    return axios.put(`${base_new_api_url}/admin/customers/${clientID}/users/${ID}`, user, getFormUrlHeader());   
  }

  static updateEntitiesFlag( form, clientID ) { 
    return axios.put(`${base_new_api_url}/admin/customers/${clientID}/flag_update_manually`, form, getFormUrlHeader());   
  }

  static updateFlagAutomatic(clientID, representativeID) { 
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/flag_automatic?representative_id=${representativeID}`, getHeader());
  }

  static updateFlagMissingTransaction(clientID, representativeID) { 
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/transaction_missing_conveyance?representative_id=${representativeID}`, getHeader());
  }

  static missingInventor(clientID, representativeID) { 
    console.log(clientID, representativeID)
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/${representativeID}/missing_inventor`, getHeader());
  }

  static findInventor(clientID, representativeID) { 
    console.log(clientID, representativeID)
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/${representativeID}/find_inventor`, getHeader());
  }
  
  static updateClientEntities( clientID ) { 
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/publish`, getHeader());   
  }

  static treeFileUpload( frm ) {
    return axios.post(`${base_new_api_url}/admin/corporate_tree`, frm, getMultiFormUrlHeader());   
    /*return axios.post(`http://localhost:3600/admin/corporate_tree`, frm, getMultiFormUrlHeader());  */ 
  }

  static createAccount( formData, clientID ) {
    return clientID > 0 ? axios.put(`${base_new_api_url}/admin/customers`, formData, getFormUrlHeader()) : axios.post(`${base_new_api_url}/admin/customers`, formData, getFormUrlHeader());   
  }

  static addUser( user, clientID ) {
    return axios.post(`${base_new_api_url}/admin/customers/${clientID}/users`, user, getFormUrlHeader());   
  }

  static removeSharingUrl( clientID ) {
    return axios.delete(`${base_new_api_url}/admin/customers/${clientID}/share`, getHeader());   
  }

  static getCompanyReport( clientID ) {
    return axios.get(`${base_new_api_url}/admin/customers/${clientID}/reports`, getHeader());   
  }

  static getTransactionEntities( transactionType ) {
    return axios.get(`${base_new_api_url}/admin/all/transactions/${transactionType}`, getFormUrlHeader());   
  }

  static deleteUser( ID, clientID ) {
    return axios.delete(`${base_new_api_url}/users/${ID}`, getFormUrlHeader());  
  }

  static addLawyer( user ) {
    return axios.post(`${base_new_api_url}/professionals`, user, getFormUrlHeader());   
  }

  static updateLawyer( user, ID ) {
    return axios.put(`${base_new_api_url}/professionals/${ID}`, user, getFormUrlHeader());   
  }

  static deleteLawyer( ID ) {
    return axios.delete(`${base_new_api_url}/professionals/${ID}`, getFormUrlHeader());   
  }

  static addDocument( document ) {
    return axios.post(`${base_new_api_url}/documents`, document, getMultiFormUrlHeader());   
  }

  static updateDocument( user, ID ) {
    return axios.put(`${base_new_api_url}/documents/${ID}`, user, getFormUrlHeader());   
  }

  static deleteDocument( ID ) {
    return axios.delete(`${base_new_api_url}/documents/${ID}`, getFormUrlHeader());   
  }

  static findCompaniesByLawFirm( lawfirmID ) {    
    return axios.get(`${base_new_api_url}/admin/company/law_firms/${lawfirmID}/companies`, getHeader());   
  }

  static findLenderCompaniesByID( lenderID ) {    
    return axios.get(`${base_new_api_url}/admin/company/lenders/${lenderID}/companies`, getHeader());   
  }

  static searchCompany( name ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/company/search/${encodeURIComponent(name)}`, header);   
  }

  static searchCompanyByAddress( address ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/company/search/address/${encodeURIComponent(address)}`, header);   
  }

  static searchAssigneeByCountry( country ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/company/search/country/${encodeURIComponent(country)}`, header);   
  }
  

  static searchTransaction( name ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/company/transactions/0?search=${encodeURIComponent(name)}`, header);   
  }  

  static searchLawFirm( name ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/company/law_firms?search=${encodeURIComponent(name)}`, header);   
  }

  static searchLenders( name ) { 
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/company/lender?search=${encodeURIComponent(name)}`, header);   
  }

  static cancelRequest () {
    if (cancel !== undefined) {
      try{
        throw cancel('Operation canceled by the user.');
      } catch (e){
        console.log("cancelRequestF", e);
      }
    }
  }

  static addCompany( data) {
    return axios.post(`${base_new_api_url}/companies`, data, getMultiFormUrlHeader());
  }

  static getReports() {
    return axios.get(`${base_new_api_url}/admin/company/report`, getHeader());
  }

  static getEventReports(representativeID) {
    return axios.get(`${base_new_api_url}/admin/company/${representativeID}/event_maintainence`, getHeader());
  }

  static getListByCompanyAddress( ID, type ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/company/${ID}/search/address/${type}`, header);   
  }

  static getListByCompanyAddressCompany( ID, formData, type ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.post(`${base_new_api_url}/admin/company/${ID}/search/address/all/${type}`, formData,  getFormUrlHeader());   
  }

  static getLawfirmListByAddress( ID ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.get(`${base_new_api_url}/admin/lawfirm/${ID}/search/address`, header);   
  }

  static getListByLawfirmAddressCompany( ID, formData ) {
    if (cancel !== undefined) {
      cancel();
    }
    let header = getHeader();
    header['cancelToken'] = new CancelToken(function executor(c) {
      cancel = c;
    })
    return axios.post(`${base_new_api_url}/admin/lawfirm/${ID}/search/address/all`, formData,  getFormUrlHeader());   
  }

  static exportDatatoSpreadsheet (clientID, formData) {
    return axios.post(`${base_new_api_url}/admin/company/cited/${clientID}/export`, formData , getFormUrlHeader());
  }

  static updateCitedAssignee (clientID, formData) {    
    return axios.put(`${base_new_api_url}/admin/company/cited/${clientID}/`, formData,  getFormUrlHeader());   
  }

  static deleteCitedAssignee (clientID, formData) {    
    const header = getHeader()
    return axios.delete(`${base_new_api_url}/admin/company/cited/${clientID}/`,  {headers: header.headers, data: formData});   
  }

  static retrieveCitePatents(clientID, companies) {
    return axios.get(`${base_new_api_url}/admin/customers/retrieve_cited_patents/${clientID}?companies=${JSON.stringify(companies)}`, getHeader());   
  }  

  static retrieveCitePatentsAssigneeLogo(formData) {
    return axios.post(`${base_new_api_url}/admin/customers/retrieve_cited_patents_logo`, formData,  getFormUrlHeader());   
  } 

  static retrieveCitePatentsAssigneeDomain(clientID, apiName, assigneeIDs) {
    return axios.get(`${base_new_api_url}/admin/customers/retrieve_cited_patents_domain/${clientID}/${apiName}?assignees=${assigneeIDs}`, getHeader());   
  } 

  static addAssigneeOrganisationToSheet (clientID, formData) {    
    return axios.post(`${base_new_api_url}/admin/company/cited/${clientID}/`, formData,  getFormUrlHeader());   
  }

  static getGoogleAuthToken( code ) {
    return axios.get(`${base_new_api_url}/admin/company/auth_token?code=${code}`, getHeader())
  }

  static getGoogleProfile( token ) {
    let url = `${base_new_api_url}/documents/profile?access_token=ACCESS_TOKEN&refresh_token=REFRESH_TOKEN`
    url = url.replace('ACCESS_TOKEN', token.access_token)
    if( token.refresh_token != undefined && token.refresh_token != 'undefined' ) {
      url = url.replace('REFRESH_TOKEN', token.refresh_token)
    }
    
    if(url.indexOf('REFRESH_TOKEN') >= 0) {
      url.replace('REFRESH_TOKEN', '')
    }   
    return axios.get(url, getHeader())
  }
} 

export default PatenTrackApi; 