// Interface สำหรับข้อมูลใบสมัครงาน
export interface ApplicationData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  appliedPosition: string;
  department: string;
  status: string;
  createdAt: string;
  source?: string; // 'ResumeDeposit' หรือ 'ApplicationForm'
  profileImage?: string;
  profileImageUrl?: string;
  // ข้อมูลส่วนตัว
  prefix?: string;
  birthDate?: string;
  age?: string;
  race?: string;
  placeOfBirth?: string;
  placeOfBirthProvince?: string;
  gender?: string;
  nationality?: string;
  religion?: string;
  maritalStatus?: string;
  currentAddress?: string;
  // ข้อมูลบัตรประชาชน
  idNumber?: string;
  idCardIssuedAt?: string;
  idCardIssueDate?: string;
  idCardExpiryDate?: string;
  // ข้อมูลการติดต่อ
  emergencyContact?: string;
  emergencyPhone?: string;
  emergencyRelationship?: string;
  // ข้อมูลที่อยู่
  registeredAddress?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    phone?: string;
    mobile?: string;
  };
  currentAddressDetail?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    homePhone?: string;
    mobilePhone?: string;
  };
  emergencyAddress?: {
    houseNumber?: string;
    villageNumber?: string;
    alley?: string;
    road?: string;
    subDistrict?: string;
    district?: string;
    province?: string;
    postalCode?: string;
    phone?: string;
  };
  emergencyWorkplace?: {
    name?: string;
    district?: string;
    province?: string;
    phone?: string;
  };
  // ข้อมูลคู่สมรส
  spouseInfo?: {
    firstName?: string;
    lastName?: string;
  };
  // ข้อมูลสิทธิการรักษา
  medicalRights?: {
    hasUniversalHealthcare?: boolean;
    universalHealthcareHospital?: string;
    hasSocialSecurity?: boolean;
    socialSecurityHospital?: string;
    dontWantToChangeHospital?: boolean;
    wantToChangeHospital?: boolean;
    newHospital?: string;
    hasCivilServantRights?: boolean;
    otherRights?: string;
  };
  // ข้อมูลการสมัครงาน
  expectedSalary?: string;
  availableDate?: string;
  currentWork?: boolean;
  unit?: string;
  skills?: string;
  languages?: string;
  computerSkills?: string;
  certificates?: string;
  references?: string;
  applicantSignature?: string;
  applicationDate?: string;
  // ข้อมูลการทำงานในภาครัฐ
  previousGovernmentService?: Array<{
    position?: string;
    department?: string;
    reason?: string;
    date?: string;
  }>;
  // ข้อมูลนายจ้างหลายราย
  multipleEmployers?: string[];
  // ข้อมูลการศึกษา
  education: Array<{
    level?: string;
    institution?: string;
    school?: string;
    major?: string;
    year?: string;
    graduationYear?: string;
    gpa?: string;
  }>;
  // ข้อมูลประสบการณ์ทำงาน
  workExperience: Array<{
    position?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    salary?: string;
    reason?: string;
  }>;
  // ข้อมูลเอกสาร
  documents?: {
    idCard?: string;
    houseRegistration?: string;
    militaryCertificate?: string;
    educationCertificate?: string;
    medicalCertificate?: string;
    drivingLicense?: string;
    nameChangeCertificate?: string;
  };
}

