/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

export interface PetInfo {
    name: string;
    breed: string;
    dateOfBirth: string;
    id: string;
    owner: string;

  }

export interface Pet {
    name: string;
    breed: string;
    dateOfBirth: string;
    id: string;
    vaccinations: VaccineInfo[];
  } 


export interface VaccineInfo {
    name: string;
    lastVaccinationDate: string;
    nextVaccinationDate: string;
    enableAlerts: boolean;
  }

export interface updatePetInfo {
    userId: string;
    orgId: string;
    email: string;
    name: string;
    breed: string;
    dateOfBirth: string;
    vaccinations: VaccineInfo[];
  } 

export interface Notifications {
    notifications: NotificationInfo;
  }

export interface NotificationInfo {
    enabled: boolean;
    emailAddress: string;
  }


export interface MedicalReport {
    diagnosis: string;
    medications: Medicine[];
    treatment: string;
    createdAt: string;
    reportId: string;
  }  

export interface UpdateMedicalReport {
    diagnosis: string;
    medications: Medicine[];
    treatment: string;
  }  

export interface Medicine {
    dosage: string;
    drugName: string;
    duration: string;
  } 
