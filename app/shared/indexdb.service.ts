import { Injectable } from '@angular/core';
import { IndexdbApiserver } from './../model/indexdbApiserver.model';
import { Apiserver } from './../model/apiserver.model';

declare var Dexie: any;

@Injectable()
export class IndexdbService {
  private dbInstance: any;

  constructor() {
    this.dbInstance = new Dexie('KapDatabase');
    this.createApiserverSchema();
  };

  openDatabase() {
    this.dbInstance.open().catch(function(error: any) {
      console.log("Open indexdb: " + error);
    })
  }

  createApiserverSchema() {
    this.dbInstance.version(1).stores({
      apiserver: '++id, name, ip, token, dashboardIp'
    });
  }

  addDataToApiserver(apiserver: Apiserver) {
    this.dbInstance.apiserver.add({name: apiserver.name,
      ip: apiserver.ip,
      token: apiserver.token,
      dashboardIp: apiserver.dashboardIp});
  }

/**
 * Get the List of Apiserver info from indexdb;
 * 
 * @returns IndexdbApiserver[]
 * 
 * @memberOf IndexdbService
 */
  getDataFromApiserver() {
    let apiserverList: IndexdbApiserver[] = [];
      this.dbInstance.apiserver.toArray().then(function(apiservers: any) {
         for (let apiserver of apiservers) {
           apiserverList.push(<IndexdbApiserver>{id: apiserver.id,
             name: apiserver.name,
             ip: apiserver.ip,
             token: apiserver.token,
             dashboardIp: apiserver.dashboardIp
            });
         }
      });
    return apiserverList;
  }

  deleteDataFromApiserver(id: number) {
    this.dbInstance.apiserver.delete(id);
  }

  updateDataFromApiserver(apiserver: IndexdbApiserver) {
    this.dbInstance.apiserver.update(apiserver.id, {name: apiserver.name,
      ip: apiserver.ip,
      token: apiserver.token,
      dashboardIp: apiserver.dashboardIp});
  }

/**
 * Get the List of Apiserver info from indexdb and resolve the data as a Promise;
 * 
 * @returns Promise
 * 
 * @memberOf IndexdbService
 */
  getPromiseDataFromApiserver() {
    let dbInstance = this.dbInstance;
    return new Promise(function(resolve, reject) {
      let apiserverList: IndexdbApiserver[] = [];
      dbInstance.apiserver.toArray().then(function(apiservers: any) {
        for (let apiserver of apiservers) {
          apiserverList.push(<IndexdbApiserver>{id: apiserver.id,
             name: apiserver.name,
             ip: apiserver.ip,
             token: apiserver.token,
             dashboardIp: apiserver.dashboardIp
            });
         }
        resolve(apiserverList);
      })
    });
  }
}

