export enum ErrorMessage {
  Guard_MalformedJWT = 'Malformed JWT',
  Guard_RequiredJWT = 'Required JWT',

  Auth_UsernameNotFound = 'Username Not Found',
  Auth_UsernameAlreadyRegistered = 'Username Already Registered',
  Auth_EmailNotFound = 'Email Not Found',
  Auth_EmailAlreadyRegistered = 'Email Already Registered',
  Auth_AddressNotFound = 'Address Not Found',
  Auth_AddressAlreadyRegistered = 'Address Already Registered',
  Auth_InvalidUsernamePassword = 'Invalid Username Password',
  Auth_InvalidEmailPassword = 'Invalid Email Password',
  Auth_InvalidNonce = 'Invalid Nonce',
  Auth_InvalidSignature = 'Invalid Signature',
  Auth_PasswordConfirmNotMatch = 'Password Confirm Not Match',
  Auth_InvalidEmailVerification = 'User Not Found Or Secret Not Matched',
  Auth_EmailAlreadyVerified = 'Email Already Verified',
  Auth_EmailVerificationUnavailable = 'Email Verification Unavailable',

  Code_UnableToResendCode = 'Unable To Resend Code',
  Code_InvalidCodeType = 'Invalid Code Type',

  TwoFA_UserNotFoundOrDeleted = 'User Not Found Or Deleted',
  TwoFA_UserAlreadyVerifiedEmail = 'User Already Verified Email',
  TwoFA_InvalidEmailVerification = 'Invalid Email Verification',
  TwoFA_EmailAlreadyVerified = 'Email Already Verified',
  TwoFA_EmailVerificationUnavailable = 'Email Verification Unavailable',
  TwoFA_EmailAlreadyRegistered = 'Email Already Registered',
  TwoFA_AuthorityNotFound = 'Authority Not Found',
  TwoFA_AccountAlreadyRegisteredEmail = 'Account Already Registered Email',
  TwoFA_AccountAlreadyLinkedWallet = 'Account Already Linked Wallet',

  KYC_AuthorityNotFound = 'Authority Not Found',
  KYC_UnboundStatus = ' Unbound Status',

  Profile_UsernameAlreadyExisted = 'Username Already Existed',

  Whitelist_Not_In_Whitelist = "User don't have whitelist access",

  Project_AlreadyCreated = 'Project with this name already created',
  Project_NotFound = 'Project Not Found',
  Project_Full = "Can't enroll because the class is already full",

  Student_AlreadyJoinedProject = 'Student already joined project',
  Student_DuplicatedSchedule = 'Student Duplicated Schedule',
  Student_NotInTimeAttendance = 'Student attendance not in time',
  Student_AlreadyAttendance = 'Already Attendanced',
  Student_CannotFindSchedule = 'Cannot find Schedule',

  Task_NotFound = 'Cannot Find Task',
  Task_AlreadySubmitted = 'Task already submitted',
}
