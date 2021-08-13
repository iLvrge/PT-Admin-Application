import *as types from './actionTypes';
import PatenTrackApi from '../api/patenTrack';




export const setTreeFileName = (name) => {
  return {
    type: types.SET_TREE_FILE_NAME,
    name
  };
};


export const setProfile = (data) => {
  return {
    type: types.SET_PROFILE,
    data
  };
};

export const getProfile = ( flag ) => {
  console.log("flag", flag);
  return dispatch => {
    return PatenTrackApi.getProfile()
      .then(res => {
        if(flag){
          dispatch(setProfile(res.data));
        }        
      })
      .catch(err => {
        throw(err);
      });
  };
};


export const setClients = (data) => {
  return {
    type: types.SET_CLIENTS,
    data
  };
};

export const getAddNewClient = (data) => {
  return {
    type: types.SET_ADD_NEW_CLIENTS,
    data
  };
};



export const setClientsLoading = (data) => {
  return {
    type: types.SET_CLIENTS_LOADING,
    data
  };
};

export const getClients = () => {
  return dispatch => {
    dispatch(setCustomersLoading(true));
    return PatenTrackApi
      .getClients()
      .then(res => {
        const data = res.data;
        dispatch(setClients(data));
        dispatch(setClientsLoading(false));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setPortfolioCompanies = (clientID, data) => {
  return {
    type: types.SET_PORTFOLIO_COMPANIES,
    clientID,
    data
  };
};


export const getPortfolioCompanies = (ID) => {
  return dispatch => {    
    return PatenTrackApi
      .getPortfolioCompanies(ID)
      .then(res => {
        dispatch(setPortfolioCompanies(ID, res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setEntitiesList = (t, data) => {
  return {
    type: types.SET_ENTITIES_LIST,
    t,
    data
  };
};

export const getEntitiesList = (clientID, portfolios, t) => {
  return dispatch => {    
    return PatenTrackApi
      .getEntitiesList(clientID, portfolios, t)
      .then(res => {
        dispatch(setEntitiesList(t, res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setTransactionList = (data) => {
  return {
    type: types.SET_TRANSACTION_LIST,
    data
  };
};

export const getTransactionList = (clientID, portfolios) => {
  return dispatch => {    
    return PatenTrackApi
      .getTransactionList(clientID, portfolios)
      .then(res => {
        dispatch(setTransactionList(res.data));
      })
      .catch(err => { 
        throw(err);
      });
  };
}; 

export const setAssignmentList = (data) => {
  return {
    type: types.SET_ASSIGNMENT_LIST,
    data
  };
};

export const getAssignmentList = (clientID, portfolios) => {
  return dispatch => {    
    return PatenTrackApi
      .getAssignmentList(clientID, portfolios)
      .then(res => {
        dispatch(setAssignmentList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setRawAssignment = (flag) => {
  return {
    type: types.SET_RAW_ASSIGNMENT,
    flag
  };
}; 

export const getRawAssignmentList = (clientID, portfolios) => {
  return dispatch => {    
    return PatenTrackApi
      .getRawAssignmentList(clientID, portfolios)
      .then(res => {
        dispatch(setAssignmentList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setKeywordList = (data) => {
  return {
    type: types.SET_KEYWORDS,
    data
  };
}; 

export const getKeywordList = () => {
  return dispatch => {    
    return PatenTrackApi
      .getKeywordList()
      .then(res => {
        dispatch(setKeywordList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const postKeyword = (formData) => {
  return dispatch => {    
    return PatenTrackApi
      .postKeyword(formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const updateKeyword = (formData, keywordID) => {
  return dispatch => {    
    return PatenTrackApi
      .updateKeyword(formData, keywordID)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const deleteKeyword = (keywordID) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteKeyword(keywordID)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setSuperKeywordList = (data) => {
  return {
    type: types.SET_SUPER_KEYWORDS,
    data
  };
}; 

export const getSuperKeywordList = () => {
  return dispatch => {    
    return PatenTrackApi
      .getSuperKeywordList()
      .then(res => {
        dispatch(setSuperKeywordList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const postSuperKeyword = (formData) => {
  return dispatch => {    
    return PatenTrackApi
      .postSuperKeyword(formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const updateSuperKeyword = (formData, keywordID) => {
  return dispatch => {    
    return PatenTrackApi
      .updateSuperKeyword(formData, keywordID)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const deleteSuperKeyword = (keywordID) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteSuperKeyword(keywordID)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};


export const setStateList = (data) => {
  return {
    type: types.SET_STATE_KEYWORDS,
    data
  };
}; 

export const getStateList = () => {
  return dispatch => {    
    return PatenTrackApi
      .getStateList()
      .then(res => {
        dispatch(setStateList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const postState = (formData) => {
  return dispatch => {    
    return PatenTrackApi
      .postState(formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const updateState = (formData, stateID) => {
  return dispatch => {    
    return PatenTrackApi
      .updateState(formData, stateID)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const deleteState = (stateID) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteState(stateID)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
};






export const setResultCleanAddress = (data) => {
  return {
    type: types.SET_CLEAN_ADDRESS_STATUS,
    data
  };
}; 

export const cleanAddress = (clientID, portfolios, formData) => {
  return dispatch => {    
    return PatenTrackApi
      .cleanAddress(clientID, portfolios, formData)
      .then(res => {
        console.log(res.data);
        dispatch(setResultCleanAddress(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};



export const setLenderList = (data) => {
  return {
    type: types.SET_LENDERS_LIST,
    data
  };
};

export const setLawFirmList = (data) => {
  return {
    type: types.SET_LAW_FIRM_LIST,
    data
  };
};

export const getLawFirmList = (clientID, portfolios) => {
  return dispatch => {    
    return PatenTrackApi
      .getLawFirmList(clientID, portfolios)
      .then(res => {
        dispatch(setLawFirmList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
}; 


export const findLawfirmsCompaniesByID = (companyID) => {
  return dispatch => {    
    return PatenTrackApi
      .findLawfirmsCompaniesByID(companyID)
      .then(res => {
        dispatch(setLawFirmList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
}; 

export const setLawyerList = (data) => {
  return {
    type: types.SET_LAWYER_LIST,
    data
  };
};

export const getLawyerList = (clientID, portfolios) => {
  return dispatch => {    
    return PatenTrackApi
      .getLawyerList(clientID, portfolios)
      .then(res => {
        dispatch(setLawyerList(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setClientAssetsList = (data) => {
  return {
    type: types.SET_ASSETS_LIST,
    data
  };
};

export const setPDFFile = ( file ) => {
  return {
    type: types.SET_PDF_FILE,
    file
  };
};

export const setPdfTabIndex = (index) => {
  return {
    type: types.SET_PDF_TAB,
    payload: index
  };
};

export const setPDFView = (view) => {
  return {
    type: types.SET_PDF_VIEW,
    view
  };
};

export const getClientAssetsList = (clientID, portfolios) => {
  return dispatch => {    
    return PatenTrackApi
      .getClientAssetsList(clientID, portfolios)
      .then(res => {
        dispatch(setClientAssetsList(res.data));
      })
      .catch(err => {
        throw(err);
      }); 
  };
};

export const setOriginalCompaniesData = (data) => {
  return {
    type: types.SET_ORIGINAL_COMPANY_DATA,
    data,
  };
};

export const getOriginalCompanyList = (companyID) => {
  /*return dispatch => {    
    return PatenTrackApi
      .getOriginalCompanyList(companyID)
      .then(res => {
        dispatch(setOriginalCompaniesData(res.data));
      })
      .catch(err => {
        throw(err);
      }); 
  };*/
};



export const updateButtonStatus = (clientID, form) => {
  return dispatch => {    
    return PatenTrackApi
      .updateButtonStatus(clientID, form)
      .then(res => {
        dispatch(getButtonsStatus(clientID));
      })
      .catch(err => {
        throw(err);
      }); 
  };
};

export const getButtonsStatus = (clientID) => {
  return dispatch => {    
    dispatch(setButtonsStatus([]));
    return PatenTrackApi
      .getButtonsStatus(clientID)
      .then(res => {
        dispatch(setButtonsStatus(res.data));
      })
      .catch(err => {
        throw(err);
      }); 
  };
};

export const getCompanyData = (clientID) => {
  return dispatch => {    
    return PatenTrackApi
      .getCompanyData(clientID)
      .then(res => {
        dispatch(setCompanyData(res.data));
      })
      .catch(err => {
        throw(err);
      }); 
  };
};

export const setInventorButtons = (flag) => {
  return { 
    type: types.SET_INVENTOR_BUTTONS,
    flag,
  };
};


export const setButtonsStatus = (data) => {
  return { 
    type: types.SET_COMPANY_BUTTONS_STATUS,
    data,
  };
};

export const setCompanyData = (data) => {
  return { 
    type: types.SET_COMPANY_DATA,
    data,
  };
};

export const updateCompanyLogo = (data) => {
  return { 
    type: types.UPDATE_COMPANY_DATA,
    data,
  };
};  

export const setClientID = (clientID) => {
  return {
    type: types.SET_CLIENT_ID,
    clientID,
  };
};

export const setSearchBar = (flag) => {
  return {
    type: types.SET_SEARCH_BAR, 
    flag,
  };
};

export const setSingleSearchBar = (flag) => {
  return {
    type: types.SET_SINGLE_SEARCH_BAR, 
    flag,
  };
};

export const updateNormalizeEntites = (formData) => {
  return dispatch => {    
    return PatenTrackApi
      .updateNormalizeEntites(formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
}

export const updateNormalizeLawFirms = (formData) => {
  return dispatch => {    
    return PatenTrackApi
      .updateNormalizeLawFirms(formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
}

export const updateNormalizeLawyers = (formData) => {
  return dispatch => {    
    return PatenTrackApi
      .updateNormalizeLawyers(formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw(err);
      });
  };
}

export const transactionUpdate = (formData, clientID) => {
  return dispatch => {    
    return PatenTrackApi
      .transactionUpdate(formData, clientID)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => { 
        throw(err);
      });
  };
} 

export const assignmentUpdate = (formData) => {
  return dispatch => {    
    return PatenTrackApi
      .assignmentUpdate(formData)
      .then(res => {
        console.log(res.data);
      })
      .catch(err => { 
        throw(err);
      });
  };
}


export const updateClientLogo = (formData, clientID) => {
  return dispatch => {    
    return PatenTrackApi
      .updateClientLogo(formData, clientID)
      .then(res => {
        dispatch(updateCompanyLogo(res.data));
      })
      .catch(err => { 
        throw(err);
      });
  };
}


export const setValidateCounter = (data) => {
  return {
    type: types.SET_VALIDATE_COUNTER,
    data
  };
};

export const setValidateLoading = (data) => {
  return {
    type: types.SET_VALIDATE_COUNTER_LOADING,
    data
  };
};

export const getValidateCounter = (companyName, flag, load) => {
  return dispatch => {
    dispatch(setValidateLoading(typeof load != 'undefined' && load === false ? false : true));
    return PatenTrackApi
      .getValidateCounter(companyName)
      .then(res => {
        //console.log("getValidateCounterFlag", flag);
        if (flag) {
          dispatch(setValidateLoading(false));
          let data = res.data;
          if(data == null) {
            data = {application: 0, patent: 0, encumbered: 0};
          }
          dispatch(setValidateCounter(data));
        }
      })
      .catch(err=> {
        throw(err);
      });
  };
};


export const setCustomers = (customerType, data) => {
  return {
    type: types.SET_CUSTOMERS,
    customerType,
    data
  };
};

export const setCustomersLoading = (data) => {
  return {
    type: types.SET_CUSTOMERS_LOADING,
    data
  };
};

export const getCustomers = (type, flag) => {
  return dispatch => {
    dispatch(setCustomersLoading(true));
    return PatenTrackApi
      .getCustomers(type)
      .then(res => {
        if (flag) {
          const data = res.data;
          dispatch(setCustomers(type, data));
          dispatch(setCustomersLoading(false));
        }
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setAssetsCount = (data) => {
  return {
    type: types.SET_ASSETS_COUNT,
    data
  };
};

export const setAssetCountLoading = (data) => {
  return {
    type: types.SET_ASSETS_COUNT_LOADING,
    data
  };
};

export const getAssetsCount = (companyName, flag, load) => {
  return dispatch => {
    dispatch(setAssetCountLoading(typeof load != 'undefined' && load === false ? false : true));
    return PatenTrackApi
      .getAssetsCount(companyName)
      .then(res => {
        if (flag) {
          dispatch(setAssetCountLoading(false));
          let data = res.data;
          if(data == null) {
            data = {weekly_transactions: 0, weekly_applications: 0, monthly_transactions: 0, montly_applications: 0, quaterly_transactions: 0, quaterly_applications: 0};
          }
          dispatch(setAssetsCount(data));
        }
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setTransactions = (data) => {
  return {
    type: types.SET_TRANSACTIONS,
    data
  };
};

export const setTransactionsLoading = (data) => {
  return {
    type: types.SET_TRANSACTIONS_LOADING,
    data
  };
};

export const getTransactions = (companyName, flag, load) => {
  return dispatch => {
    dispatch(setTransactionsLoading(typeof load != 'undefined' && load === false ? false : true));
    return PatenTrackApi
      .getTransactions(companyName)
      .then(res => {
        if (flag) {
          dispatch(setTransactionsLoading(false));
          let data = res.data;
          if(data == null) {
            data = {buy: 0, sale: 0, security: 0, release: 0, license_in: 0, license_out: 0};
          }
          dispatch(setTransactions(data));
        }
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setCustomersNameParties = (name, tabId, parentNode, data) => {  
  return {
    type: types.SET_CUSTOMERS_NAME_PARTIES,
    name,
    tabId,
    parentNode,
    data
  }
};

export const setCustomersNamePartiesLoading = (data) => {
  return {
    type: types.SET_CUSTOMERS_NAME_PARTIES_LOADING,
    data
  };
};

export const getCustomersParties = (name, tabId, parentNode) => {
  //console.log("tabIdddddd", tabId, parentCompany);
  return dispatch => {
    dispatch(setCustomersNamePartiesLoading(true));
    return PatenTrackApi
      .getCustomersParties(name, tabId) 
      .then(res => {
        /*console.log("tabId", name, tabId, parentNode);*/
        dispatch(setCustomersNameParties(name, tabId, parentNode, res.data));
        dispatch(setCustomersNamePartiesLoading(false));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setCustomersNameCollections = (name, tabId, parentNode, currentNode,  data) => {  
  return {
    type: types.SET_CUSTOMERS_NAME_COLLECTIONS,
    name,
    tabId,
    parentNode,
    currentNode,
    data
  }
};

export const setCustomersNameCollectionsLoading = (data) => {
  return {
    type: types.SET_CUSTOMERS_NAME_COLLECTIONS_LOADING,
    data
  };
};

export const getCustomersNameCollections = (name, tabId, parentNode, currentNode, parentCompany) => {
  //console.log("tabIdddddd", tabId, parentCompany);
  return dispatch => {
    dispatch(setCustomersNameCollectionsLoading(true));
    return PatenTrackApi
      .getCustomersNameCollections(name, parentCompany, tabId) 
      .then(res => {
        //console.log("tabId", tabId);
        dispatch(setCustomersNameCollections(name, tabId, parentNode, currentNode, res.data));
        dispatch(setCustomersNameCollectionsLoading(false));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setCustomerRFIDAssets = (rfID, tabId, parentNode, parentNode1, currentNode, data) => {
  return {
    type: types.SET_CUSTOMER_RFID_ASSETS,
    rfID,
    tabId, 
    parentNode, 
    parentNode1, 
    currentNode,
    data
  };
};

export const setCustomersRFIDAssetsLoading = (data) => {
  return {
    type: types.SET_CUSTOMER_RFID_ASSETS_LOADING,
    data
  };
};

export const getCustomerRFIDAssets = (rfID, tabId, parentNode, parentNode1, currentNode) => {
  return dispatch => {
    dispatch(setCustomersRFIDAssetsLoading(true));
    return PatenTrackApi.getCustomerRFIDAssets(rfID)
      .then(res => {
        dispatch(setCustomerRFIDAssets(rfID, tabId, parentNode, parentNode1, currentNode, res.data));
        dispatch(setCustomersRFIDAssetsLoading(false));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setErrorItems = (itemType, data) => {
  return {
    type: types.SET_ERRORS_ITEMS,
    itemType,
    data
  };
};

export const setErrorItemsAppend = (itemType, data, currentTab) => {
  return {
    type: types.SET_ERRORS_ITEMS_APPEND,
    itemType,
    currentTab,
    data
  };
};

export const setErrorItemsLoading = (data) => {
  return {
    type: types.SET_ERRORS_ITEMS_LOADING,
    data
  };
};

export const getErrorItems = (type, companyName, flag, load) => {  
  return dispatch => {
    dispatch(setErrorItemsLoading(typeof load != 'undefined' ? load : true));
    return PatenTrackApi
      .getErrorItems(type, companyName)
      .then(res => {
        dispatch(setErrorItemsLoading(false));
        dispatch(setErrorItems(type, res.data))
      }) 
      .catch(err => {
        throw(err);
      });
  }
};

export const fetchMoreFixItItems = (currentTab, from, companyName) => { 
  return dispatch => {
    return PatenTrackApi
      .getErrorItems('list', companyName, `from=${from}&tab=${currentTab}`)
      .then(res => {
        dispatch(setErrorItemsAppend('list', res.data, currentTab));
      }) 
      .catch(err => {
        throw(err);
      });
  }
};

export const selectTreeCompany = (companyName) => {
  return {
    type: types.SET_TREE_COMPANY_SELECT,
    company_name: companyName
  };
}

export const setRecordItems = (itemType, itemOption, data) => {
  return {
    type: types.SET_RECORD_ITEMS,
    itemType,
    itemOption,
    data
  };
};

export const setRecordItemsLoading = (data) => {
  return {
    type: types.SET_RECORD_ITEMS_LOADING,
    data
  };
};

export const getRecordItems = (type, option, flag) => {
  console.log("option", option);
  return dispatch => {
    dispatch(setRecordItemsLoading(true));
    return PatenTrackApi
      .getRecordItems(type, option)
      .then(res => {
        if (flag) {
          dispatch(setRecordItemsLoading(false));
          dispatch(setRecordItems(type, option, res.data))
        }
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const postRecordItems = (data, type) => {
  return dispatch => {
    return PatenTrackApi
      .postRecordItems(data, type)
      .then(res => {        
        if(typeof res == "object") {
          if(typeof res.data !== "undefined") {
            dispatch(getComments(res.data.subject_type, res.data.subject));                       
            //dispatch(setShareUrl( res.data.share_url ));
            if(typeof res.data.share_url !== "undefined") {
              let body  = `${res.data.comment} \n\n\n ${res.data.document} \n\n\n ${res.data.share_url}`;
              window.open(`mailto:${res.data.email_address}?subject=Fix it&body=${encodeURIComponent(body)}`,"_BLANK");
            }
          } else {
            //
          }
        }
        
        dispatch(getRecordItems(type, 'count', 1))
        dispatch(getRecordItems(type, 'list', 1))        
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const setRecord = (data) => {
  return {
    type: types.SET_RECORD,
    data
  };
};

export const findRecord = (ID) => {
  return dispatch => {
    dispatch(setCommentsLoading(true));
    return PatenTrackApi
      .findRecord(ID)
      .then(res => {   
        dispatch(setCommentsLoading(false));
        dispatch(setComments([]));
        dispatch(setRecord(null));
        if(res.data.id > 0) {
          if(res.data.patent_number != "" && res.data.type == "0") {
            if( res.data.option == "1" ) {
              dispatch(setCurrentCollectionID(res.data.patent_number));
              dispatch(setCurrentAsset(''));
              dispatch(setIllustrationUrl('about:blank'));
              dispatch(getFilterTimeLine( 'Lookout Inc', res.data.patent_number, 2 ));
              dispatch(getCollectionIllustration(res.data.patent_number));
            } else {
              dispatch(setCurrentAsset(res.data.patent_number));
              dispatch(setCurrentCollectionID(''));
              dispatch(setIllustrationUrl('about:blank'));
              dispatch(getFilterTimeLine( 'Lookout Inc', res.data.patent_number, 3 ));
              dispatch(getAssets(res.data.patent_number));
              dispatch(getAssetsOutsource(1, res.data.patent_number));
            }
          }
          if(res.data.type == "1"){             
            dispatch(setRecord(res.data));
          } else {
            dispatch(getComments(res.data.option == '0' ? 'asset' : 'collection', res.data.patent_number));
          }
        }
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const completeRecord = (data, type) => {
  return dispatch => {
    return PatenTrackApi
      .completeRecord(data, type)
      .then(res => {   
        dispatch(getRecordItems(type, 'count', 1))
        dispatch(getRecordItems(type, 'list', 1))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const setLawyerItems = (data) => {
  return {
    type: types.SET_LAWYERS_LIST,
    data
  };
};

export const getLawyers = (flag) => {
  return dispatch => {    
    return PatenTrackApi
      .getLawyers()
      .then(res => {
        if (flag)
          dispatch(setLawyerItems(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const addLawyer = ( user ) => {
  return dispatch => {    
    return PatenTrackApi
      .addLawyer( user )
      .then(res => {
        console.log("userAdded", res);  
        dispatch(getLawyers());
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const updateLawyer = ( user, ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateLawyer( user, ID )
      .then(res => {
        dispatch(setEditRow(true));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const deleteLawyer = ( ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteLawyer( ID )
      .then(res => {
        dispatch(setDeleteRow(true));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const setDocumentItems = (data) => {
  return {
    type: types.SET_DOCUMENTS_LIST,
    data
  };
};

export const setDocumentsLoading = (t) => {
  return {
    type: types.SET_DOCUMENT_ITEMS_LOADING,
    payload: t
  };
};

export const getDocuments = (flag) => {
  return dispatch => {    
    return PatenTrackApi
      .getDocuments()
      .then(res => {
        dispatch(setDocumentItems(res.data))          
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const addDocument = ( document ) => {
  return dispatch => {    
    dispatch(setDocumentsLoading(true));
    return PatenTrackApi
      .addDocument( document )
      .then(res => {
        dispatch(setDocumentsLoading(false));
        dispatch(getDocuments());
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const updateDocumentRow = (row) => {
  return {
    type: types.SET_DOCUMENT_UPDATE_ROW,
    row
  };
};

export const updateDocument = ( user, ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateDocument( user, ID )
      .then(res => {
        dispatch(setEditRow(true));
        dispatch(updateDocumentRow(res.data));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const deleteDocument = ( ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteDocument( ID )
      .then(res => {
        dispatch(setDeleteRow(true));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const setCompanies = (data) => {
  return {
    type: types.SET_COMPANIES_LIST,
    data
  };
};

export const setCompanyLoading = ( t ) => {
  return {
    type: types.SET_COMPANY_LOADING,
    payload: t
  };
};

export const getCompanies = () => {
  return dispatch => {    
    dispatch(setCompanyLoading(true));
    return PatenTrackApi
      .getCompanies()
      .then(res => {
          dispatch(setCompanyLoading(false));
          dispatch(setCompanies(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const deleteCompany = (list) => {
  return dispatch => {
    return PatenTrackApi.deleteCompany(list)
      .then(res => {
        dispatch(getCompanies());
      })
      .catch(err => {
        throw( err );
      });
  };
};

export const setMainCompanyChecked = ( t ) => {
  return {
    type: types.SET_MAIN_COMPANY_SELECTED,
    payload: t
  };
};

export const setSelectedCompany = ( name ) => {
  return {
    type: types.SET_SUB_COMPANY_SELECTED_NAME,
    name
  };
};

export const setSelectedSearchCompanies = ( name ) => {
  return {
    type: types.SET_SEARCH_COMPANY_SELECTED,
    name
  };
};

export const setSettingText = ( name ) => {  
  return {
    type: types.SET_SETTING_TEXT,
    name
  };
};


export const setSearchCompanyLoading = ( t ) => {
  return {
    type: types.SET_SEARCH_COMPANY_LOADING,
    payload: t
  };
};

export const setSearchCompanies = ( data ) => {
  return {
    type: types.SET_SEARCH_COMPANY,
    list: data
  };
};



export const cancelRequest = ( ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(false));
    PatenTrackApi.cancelRequest();
    dispatch(setSearchCompanyLoading(false));
    dispatch(setSearchCompanies([]))
  }
};



export const findCompaniesByLawFirm = ( lawfirmID ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true));
    return PatenTrackApi
      .findCompaniesByLawFirm( lawfirmID )
      .then(res => {        
        dispatch(setSearchCompanyLoading(false)); 
        dispatch(setLawFirmList([]))
        dispatch(setSearchCompanies(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const findLenderCompaniesByID = ( lenderID ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true));
    return PatenTrackApi
      .findLenderCompaniesByID( lenderID )
      .then(res => {        
        dispatch(setSearchCompanyLoading(false));
        dispatch(setSearchCompanies(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};


export const searchCompany = ( name ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true));
    return PatenTrackApi
      .searchCompany( name )
      .then(res => {        
        dispatch(setSearchCompanyLoading(false));
        dispatch(setSearchCompanies(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const searchCompanyByAddress = ( address ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true));
    return PatenTrackApi
      .searchCompanyByAddress( address )
      .then(res => {        
        dispatch(setSearchCompanyLoading(false));
        dispatch(setSearchCompanies(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const searchTransaction = ( name ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true));
    return PatenTrackApi
      .searchTransaction( name )
      .then(res => {        
          dispatch(setSearchCompanyLoading(false));
          dispatch(setTransactionList(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
}; 

export const searchLawFirm = ( name ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true));
    return PatenTrackApi
      .searchLawFirm( name )
      .then(res => {        
          dispatch(setSearchCompanyLoading(false));
          dispatch(setLawFirmList(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const searchLenders = ( name ) => {
  return dispatch => {    
    dispatch(setSearchCompanyLoading(true));
    return PatenTrackApi
      .searchLenders( name )
      .then(res => {        
          dispatch(setSearchCompanyLoading(false));
          dispatch(setLenderList(res.data))
      })
      .catch(err => { 
        throw(err);
      });
  }
};

export const setRetreiveCompanyAssetsHolding = ( flag ) => {
  return {
    type: types.SET_RETRIEVE_COMPANY_ASSETS_HOLDING,
    flag
  }
}

export const setEntityAssets = ( data ) => {
  return {
    type: types.SET_ENTITY_ASSETS,
    data
  };
};

export const getEntityAssets = ( entityID ) => { 
  return dispatch => {    
    return PatenTrackApi
      .getEntityAsset( entityID )
      .then(res => {        
        dispatch(setEntityAssets(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};



export const addCompany = (data) => {
  return dispatch => {
    return PatenTrackApi
      .addCompany(data)
      .then(res => {        
        if(typeof res == "object") {
          console.log(res.data);          
        }
        dispatch(getCompanies());
        dispatch(getTimeLine(0, true));
        dispatch(getCustomers('employees', true));
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const setUsers = (data) => {
  return {
    type: types.SET_USERS_LIST,
    data
  };
};

export const setPortfolios = (data) => {
  return {
    type: types.SET_PORTFOLIO_LIST,
    data
  };
};


export const setAdminUsersLoading = (data) => {
  return {
    type: types.SET_ADMIN_USERS_LIST_LOADING,
    data
  };
};

export const getAdminUsers = () => {
  return dispatch => {    
    dispatch(setAdminUsersLoading(true));
    return PatenTrackApi
      .getAdminUsers()
      .then(res => {
        dispatch(setAdminUsers(res.data))    
        dispatch(setAdminUsersLoading(false));
      })
      .catch(err => {
        dispatch(setAdminUsersLoading(false));
        throw(err);
      });
  }
};

export const setAdminUsers = (data) => {
  return {
    type: types.SET_ADMIN_USERS_LIST,
    data
  };  
};

export const addAdminUser = ( user ) => {
  return dispatch => {    
    return PatenTrackApi
      .addAdminUser( user )
      .then(res => {
        dispatch(getAdminUsers());
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const updateAdminUser = ( user, ID) => {
  return dispatch => {    
    return PatenTrackApi
      .updateAdminUser( user, ID)
      .then(res => {
        dispatch(setAdminEditRow(true));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};


export const setAdminEditRow = (data) => {
  return {
    type: types.SET_ADMIN_EDIT_ROW,
    payload: data
  };
};

export const deleteAdminUser = ( ID ) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteAdminUser( ID)
      .then(res => {
        dispatch(setAdminDeleteRow(true));
      })
      .catch(err => {
        throw(err);
      });
  }
};


export const setAdminDeleteRow = (data) => {
  return {
    type: types.SET_ADMIN_DELETE_ROW,
    payload: data
  };
};

export const setUsersLoading = (data) => {
  return {
    type: types.SET_USERS_LIST_LOADING,
    data
  };
};

export const setAccountUserForm = (flag) => {
  return { 
    type: types.SET_ACCOUNT_USER_FORM,
    flag
  };
};

export const getUsers = (clientID) => {
  return dispatch => {    
    dispatch(setUsersLoading(true));
    return PatenTrackApi
      .getUsers(clientID)
      .then(res => {
        dispatch(setUsers(res.data))    
        
        dispatch(setUsersLoading(false));
      })
      .catch(err => {
        dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const setEditRow = (data) => { 
  return {
    type: types.SET_EDIT_ROW,
    payload: data
  };
};

export const updateUser = ( user, ID, clientID ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateUser( user, ID, clientID )
      .then(res => {
        console.log("editUser", res);  
        dispatch(setEditRow(true));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const addUser = ( user, clientID ) => {
  return dispatch => {    
    return PatenTrackApi
      .addUser( user, clientID )
      .then(res => {
        console.log("userAdded", res);  
        dispatch(getUsers(clientID));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};



export const setDeleteRow = (data) => {
  return {
    type: types.SET_DELETE_ROW,
    payload: data
  };
};

export const deleteUser = ( ID, clientID ) => {
  return dispatch => {    
    return PatenTrackApi
      .deleteUser( ID, clientID )
      .then(res => {
        dispatch(setDeleteRow(true));
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const createAccount = ( form, clientID ) => {
  return dispatch => {    
    return PatenTrackApi
      .createAccount( form, clientID )
      .then(res => { 
        console.log("res", res.data);      
        /* dispatch(getClients()); */
        dispatch(getAddNewClient(res.data));
        if(typeof res.data.organisation_id !== 'undefined') {
          dispatch(setClientID(res.data.organisation_id));
          dispatch(getCompanyData(res.data.organisation_id));
        }
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const updateEntitiesFlag = ( form, clientID, flag ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateEntitiesFlag( form, clientID )
      .then(res => { 
        console.log("res", res.data); 
        /*let neFlag = flag == 0 ? 1 : 0;
        dispatch(setFlag(neFlag));
        dispatch(getEntitiesList(clientID, flag == 0 ? 2 : 1));*/
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const updateClientEntities = ( clientID ) => {
  return dispatch => {    
    return PatenTrackApi
      .updateClientEntities( clientID )
      .then(res => { 
        console.log("res", res.data); 
        dispatch(setEntitiesUpdateMessage(res.data));
      })
      .catch(err => {
        //dispatch(setUsersLoading(false));
        throw(err);
      });
  }
};

export const setEntitiesUpdateMessage = (data) => {
  return { 
    type: types.SET_ENTITES_UPDATE_MESSAGE,
    data
  };
};

export const setFlag = (flag) => {
  return { 
    type: types.SET_FLAG,
    flag
  };
};

export const setCurrentWidget = (data) => {
  return {
    type: types.SET_CURRENT_WIDGET,
    data
  };
};

export const setCookie = () => {
  return {
    type: types.SET_COOKIE,
  }; 
};

export const initStage = () => {
  return {
    type: types.INIT_STAGE,
  };
};

export const changeWidthAndHeight = (screenHeight, screenWidth) => {
  return {
    type: types.CHANGE_WIDTH_AND_HEIGHT,
    screenHeight,
    screenWidth
  };
};

export const initEnvironment = () => {
  return dispatch => {
    dispatch(initStage());
    dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));

    window.onresize = () => {
      dispatch(changeWidthAndHeight(window.innerHeight, window.innerWidth));
    }
  };
};

export const setMessagesCount = (data) => {
  return {
    type: types.SET_MESSAGES_COUNT,
    data
  };
};

export const getMessagesCount = () => {
  return dispatch => {
    return PatenTrackApi
      .getMessages('count')
      .then(res => {
        dispatch(setMessagesCount(res.data.count))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const setAlertsCount = (data) => {
  return {
    type: types.SET_ALERTS_COUNT,
    data
  };
};

export const getAlertsCount = () => {
  return dispatch => {
    return PatenTrackApi
      .getAlerts('count')
      .then(res => {
        dispatch(setAlertsCount(res.data.count))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const setCharts = (option, data) => {
  return {
    type: types.SET_CHARTS,
    option,
    data
  };
};

export const setChartOne = (data, option) => {
  return {
    type: types.SET_CHART_ONE,
    option,
    data
  };
};

export const setChartsLoading = (data) => {
  return {
    type: types.SET_CHARTS_LOADING,
    data
  };
};

export const getCharts = (option, flag) => {
  return dispatch => {
    dispatch(setChartsLoading(true));
    return PatenTrackApi
      .getCharts(option)
      .then(res => {
        dispatch(setChartsLoading(false));
        dispatch(setCharts(option, res.data[0]))  
      })
      .catch(err => {
        throw(err);
      });  
  };
};

export const getChartsOne = (option, flag) => {
  return dispatch => {
    dispatch(setChartsLoading(true));
    return PatenTrackApi
      .getChartsOne(option)
      .then(res => {
        dispatch(setChartsLoading(false));
        dispatch(setChartOne(res.data, option))
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setTimeLine = (data) => {
  return {
    type: types.SET_TIME_LINE,
    data
  };
};

export const setTimeLineLoading = (data) => {
  return {
    type: types.SET_TIME_LINE_LOADING,
    data
  };
};

export const getTimeLine = (tabId, flag) => {
  console.log("TIMELINE", tabId, flag);
  return dispatch => { 
    dispatch(setTimeLineLoading(true));
    dispatch(setAddYears(true));
    return PatenTrackApi.getTimeLine(tabId)
      .then(res => {
        if (flag) {
          dispatch(setTimeLineLoading(false));
          dispatch(setTimeLine(res.data))
        }
      })
      .catch(err => { 
        throw err;
      });
  };
};

export const getTimelineFilterWithDate = (groupId, startDate, endDate, scroll) => {
  return dispatch => {
    dispatch(setAddYears(false));
    return PatenTrackApi.getTimelineFilterWithDate(groupId, startDate, endDate, scroll)
      .then(res => {
        dispatch(setTimeLineLoading(false));
        dispatch(setTimeLine(res.data))
      })
      .catch(err => { 
        throw err;
      });
  };
};

export const getFilterTimeLine = ( grandParent, label, depth, tabId ) => {
  setTimeLineLoading(true);
  return dispatch => {
    dispatch(setTimeLineLoading(true));    
    return PatenTrackApi.getFilterTimeLine( grandParent, label, depth, tabId )
      .then(res => {
        dispatch(setTimeLineLoading(false));
        dispatch(setTimeLine(res.data))
      })
      .catch(err => {
        throw err;
      });
  };
};

export const setAddYears = (option) => {
  return {
    type: types.SET_ADD_YEARS,
    option
  };
};

export const setIllustrationUrl = (url) => {
  return {
    type: types.SET_ILLUSTRATION_URL,
    illustrationUrl: url
  };
};

export const setComments = (data) => {
  return {
    type: types.SET_COMMENTS,
    data
  };
};

export const setCommentsLoading = (data) => {
  return {
    type: types.SET_COMMENTS_LOADING,
    data
  };
};

export const getComments = (type, value) => {
  return dispatch => {
    dispatch(setCommentsLoading(true));
    return PatenTrackApi.getComments(type, value)
      .then(res => {
        dispatch(setCommentsLoading(false));
        dispatch(setComments(res.data))
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const commentSaved = (message) => {
  return {
    type: types.SET_COMMENT_SAVED,
    message: message
  };
}

export const updateComment = ( comment, method, type, value ) => {  
  return dispatch => {
  return PatenTrackApi.updateComment(method, comment, type, value)
      .then(res => {
        console.log(res);
        dispatch(commentSaved(res.data));
        dispatch(getComments(type, value));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setAssets = (data) => {
  return {
    type: types.SET_ASSETS,
    data
  };
};

export const setAssetsLoading = (data) => {
  return {
    type: types.SET_ASSETS_LOADING,
    data
  };
};

export const getAssets = (patentNumber) => {
  return dispatch => {
    dispatch(setAssetsLoading(true));
    console.log("patentNumber", patentNumber);
    return PatenTrackApi.getAssetsByPatentNumber(patentNumber)
      .then(res => {
        dispatch(setAssetsLoading(false));
        dispatch(setAssets(res.data));
      }) 
      .catch(err => {
        throw(err);
      });
  };
};

export const missingInventor = (customerID, representativeID) => {
  console.log(customerID, representativeID)
  return dispatch => {
    return PatenTrackApi.missingInventor(customerID, representativeID)
      .then(res => {
        dispatch(setFlagMessage(res.data));
      }) 
      .catch(err => {
        throw(err);
      });
  };
};

export const findInventor = (customerID, representativeID) => {
  console.log(customerID, representativeID)
  return dispatch => {
    return PatenTrackApi.findInventor(customerID, representativeID)
      .then(res => {
        dispatch(setFlagMessage(res.data));
      }) 
      .catch(err => {
        throw(err);
      });
  };
};

export const updateFlagAutomatic = (customerID) => {
  return dispatch => {
    return PatenTrackApi.updateFlagAutomatic(customerID)
      .then(res => {
        dispatch(setFlagMessage(res.data));
      }) 
      .catch(err => {
        throw(err);
      });
  };
};

export const treeFileUpload = (form) => {
  return dispatch => {
    return PatenTrackApi.treeFileUpload(form)
      .then(res => {
        //dispatch(setCorporateTree(res.data));
        dispatch(setCorporateHTMLFile(res.data));
      }) 
      .catch(err => {
        throw(err);
      });
  };
};

export const setCorporateHTMLFile = (file) => {
  return {
    type: types.SET_CORPORATE_HTML_FILE,
    file
  };
};

export const setCorporateTree = (data) => {
  return {
    type: types.SET_CORPORATE_TREE,
    data
  };
};

export const setSearchHeight = (height) => {
  return {
    type: types.SET_SEARCH_HEIGHT,
    height
  };
};

export const setTreeHeight = (height) => {
  return {
    type: types.SET_TREE_HEIGHT,
    height
  };
};

export const getTransactionEntities = (transactionType) => {
  return dispatch => {
    return PatenTrackApi.getTransactionEntities(transactionType)
      .then(res => {
        dispatch(setSearchCompanyLoading(false));
        dispatch(setSearchCompanies(res.data));
      }) 
      .catch(err => {
        throw(err);
      });
  };
};

export const setFlagMessage = (data) => {
  return {
    type: types.SET_MESSAGE,
    data
  };
};


export const setUploadTreeFile = (flag) => {
  return {
    type: types.SET_UPLOAD_TREE_FORM,
    flag
  };
};

export const getCollectionIllustration = (rfID) => {
  return dispatch => {
    dispatch(setAssetsLoading(true));
    return PatenTrackApi.getCollectionIllustration(rfID)
      .then(res => {
        dispatch(setAssetsLoading(false));
        dispatch(setIllustrationUrl("./d3/index.html"));
        dispatch(setAssets(res.data));
      })
      .catch(err => {
        throw(err);
      });
    };
};

export const setAssetsOutsource = (data) => {
  return {
    type: types.SET_ASSETS_OUTSOURCE,
    data
  };
};

export const setAssetsOutsourceLoading = (data) => {
  return {
    type: types.SET_ASSETS_OUTSOURCE_LOADING,
    data
  };
};

export const getAssetsOutsource = (type, patentNumber) => {
  return dispatch => {
    dispatch(setAssetsOutsourceLoading(true));
    return PatenTrackApi.geteAssetsOutsourceByPatentNumber(type, patentNumber)
      .then(res => {
        dispatch(setAssetsOutsourceLoading(false));
        dispatch(setAssetsOutsource(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setSubCompanies = (data, name) => {
  return {
    type: types.SET_SUB_COMPANIES,
    data,
    name
  };
};

export const getSubCompanies = (name) => {
  return dispatch => {
    return PatenTrackApi.getSubCompanies(name)
      .then(res => {
        dispatch(setSubCompanies(res.data, name));
      })
      .catch(err => {
        throw(err);
      });
  };
}; 

export const deleteSameCompany = (name) => {
  return dispatch => {
    return PatenTrackApi.deleteSameCompany(name)
      .then(res => {
        dispatch(getCompanies());
      })
      .catch(err => {
        throw( err );
      });
  };
};

export const setCompanyTreeOpen = (key, value) => {
  return {
    type: types.SET_COMPANY_TREE_OPEN,
    key,
    value
  };
};

export const resetCompanyTree = () => {
  return {
    type: types.RESET_COMPANY_TREE,
  };
};

export const setTreeOpen = (key, value) => {
  return {
    type: types.SET_TREE_OPEN,
    key,
    value
  };
};

export const setCurrentAsset = (data) => {
  return {
    type: types.SET_CURRENT_ASSET,
    data
  };
};

export const setCurrentAssetType = (data) => {
  return {
    type: types.SET_CURRENT_ASSET_TYPE,
    data
  };
}; 

export const setCurrentCollectionID = (data) => {
  return {
    type: types.SET_CURRENT_COLLECTION_ID,
    data
  };
};

export const setSiteLogo = (data) => {
  return {
    type: types.SET_SITE_LOGO,
    data
  };
};

export const getSiteLogo = () => {
  return dispatch => {
    return PatenTrackApi.getSiteLogo()
      .then(res => {
        dispatch(setSiteLogo(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const getReports = () => {
  return dispatch => {
    return PatenTrackApi.getReports()
      .then(res => {
        dispatch(setReports(res.data));
      })
      .catch(err => {
        throw(err);
      });
  };
};

export const setReports = (data) => {
  return {
    type: types.SET_COMPANY_REPORTS,
    data
  };
}; 

export const setCurTreeLevel1 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL1,
    tabId,
    data
  };
};

export const initCurTreeLevel1 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL1,
    tabId
  };
};

export const setCurTreeLevel2 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL2,
    tabId,
    data
  };
};

export const initCurTreeLevel2 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL2,
    tabId
  };
};

export const setCurTreeLevel3 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL3,
    tabId,
    data
  };
};

export const initCurTreeLevel3 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL3,
    tabId
  };
};

export const setCurTreeLevel4 = (tabId, data) => {
  return {
    type: types.SET_CUR_TREE_LEVEL4,
    tabId,
    data
  };
};

export const initCurTreeLevel4 = (tabId) => {
  return {
    type: types.SET_CUR_TREE_LEVEL4,
    tabId
  };
};

export const setNestGridTabIndex = (index) => {
  return dispatch => {
    dispatch(getTimeLine(index, true));
    dispatch(updateNestGridTabIndex(index));
  }
};
export const updateNestGridTabIndex = (index) => {
  return {
    type: types.SET_NESTGRID_TAB,
    payload: index
  };
};


export const setTimelineTabIndex = (index) => {
  return {
    type: types.SET_TIMELINE_TAB,
    payload: index
  };
};

export const setChartTabIndex = (index) => {
  return {
    type: types.SET_CHART_TAB,
    payload: index
  };
};

export const setFixItTabIndex = (index) => {
  return {
    type: types.SET_FIXIT_TAB,
    payload: index
  };
};

export const setRecordItTabIndex = (index) => {
  return {
    type: types.SET_RECORDIT_TAB,
    payload: index
  };
};

export const setSettingTabIndex = (index) => {
  return {
    type: types.SET_SETTING_TAB,
    payload: index
  };
};

export const treeToggle = (data) => {
  return {
    type: types.SET_TREE_TOGGLE,
    data
  };
};

export const treeExpand = (data) => {
  return {
    type: types.SET_TREE_EXPAND,
    data
  };
};

export const setSearchedAddressLawfirm = (ID) => {
  return {
    type: types.SET_LAW_FIRM_ID,
    ID
  };
};

export const setSearchAddressModal = (flag) => {
  return {
    type: types.SET_SEARCH_ADDRESS_MODAL,
    flag
  };
};

export const setSearchByIDLawFirms = (data) => {
  return {
    type: types.SET_SEARCH_BY_ID_LAWFIRM_COMPANIES,
    list: data
  };
};

export const setSearchByIDLawfirmAddress = ( data ) => {
  return {
    type: types.SET_SEARCH_LAWFIRM_ADDRESSES,
    list: data
  };
};

export const setSearchByIDLawfirmLoading = ( t ) => {
  return {
    type: types.SET_SEARCH_LAWFIRM_ID_LOADING,
    payload: t
  };
};

export const getLawfirmListByAddress = ( ID ) => {
  return dispatch => {    
    dispatch(setSearchByIDLawfirmLoading(true));
    return PatenTrackApi
      .getLawfirmListByAddress( ID )
      .then(res => {        
        dispatch(setSearchByIDLawfirmLoading(false));
        dispatch(setSearchByIDLawfirmAddress(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const getListByLawfirmAddressCompany = ( ID, formData ) => {
  return dispatch => {    
    dispatch(setSearchByIDLawfirmLoading(true));
    return PatenTrackApi
      .getListByLawfirmAddressCompany( ID, formData )
      .then(res => {        
        dispatch(setSearchByIDLawfirmLoading(false));
        dispatch(setSearchByIDLawFirms(res.data))
      })
      .catch(err => { 
        throw(err);
      });
  }
};

  
export const setSearchedCompanyAddress = (ID) => {
  return {
    type: types.SET_COMPANY_ADDRESS_ID,
    ID
  };
};

export const setSearchCompanyAddressModal = (flag) => {
  return {
    type: types.SET_SEARCH_COMPANY_ADDRESS_MODAL,
    flag
  };
};

export const setSearchModalType = (flag) => {
  return {
    type: types.SET_SEARCH_MODAL_TYPE,
    flag
  };
};

export const setSearchByCompanyIDAddress = ( data ) => {
  return {
    type: types.SET_SEARCH_COMPANY_ADDRESSES,
    list: data
  };
};

export const setSearchByIDCompanies = ( data ) => {
  return {
    type: types.SET_SEARCH_COMPANY_ID_ADDRESS,
    list: data
  };
};

export const setSearchByIDCompanyLoading = ( t ) => {
  return {
    type: types.SET_SEARCH_COMPANY_ID_LOADING,
    payload: t
  };
};

export const getCompanyListByAddress = ( ID, type = 0 ) => {
  return dispatch => {    
    dispatch(setSearchByIDCompanyLoading(true));
    return PatenTrackApi
      .getListByCompanyAddress( ID, type )
      .then(res => {   
        dispatch(setSearchByIDCompanyLoading(false));
        dispatch(setSearchByCompanyIDAddress(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const getListByCompanyAddressCompany = ( ID, formData, type = 0 ) => {
  return dispatch => {    
    dispatch(setSearchByIDCompanyLoading(true));
    return PatenTrackApi
      .getListByCompanyAddressCompany( ID, formData, type )
      .then(res => {        
        dispatch(setSearchByIDCompanyLoading(false));
        dispatch(setSearchByIDCompanies(res.data))
      })
      .catch(err => {
        throw(err);
      });
  }
};

export const toggleShow3rdParities = flag => ({
  type: types.TOGGLE_SHOW_3RD_PARTIES,
  flag,
})
