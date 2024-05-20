import { gql } from "@apollo/client";

export const LoginOrSignUp = gql`
  mutation LoginOrSignup($authRequest: MagicAuthRequest!) {
    loginOrSignup(authRequest: $authRequest) {
      token
    }
  }
`;

export const CREATE_ORGANIZATION = gql `
mutation CreateOrganization($organization: OrganizationDto) {
  createOrganization(organization: $organization) {
    code
    description
  }
}
`;

export const CREATE_OPERATOR = gql `
mutation AddOperatorToOrganization($newOperatorArgs: NewOperatorArgs) {
  addOperatorToOrganization(newOperatorArgs: $newOperatorArgs) {
    code
    description
    title 
  }
}
`
export const CREATE_DEPARTMENT = gql `
mutation CreateDepartment($department: DepartmentDto) {
  createDepartment(department: $department) {
    name
    senderName
  }
}
`
export const DELETE_OPERATOR = gql `
mutation DeleteOperator($operatorId: String) {
  deleteOperator(operatorId: $operatorId) {
    code 
    description
  }
}
`
export const DELETE_DEPARTMENT = gql `
mutation DeleteDepartment($departmentId: String) {
  deleteDepartment(departmentId: $departmentId) {
    code
    description
  }
}
`
export const STKPUSH = gql `
mutation StkPushPayment($stkPush: STKPushObj) {
  stkPushPayment(stkPush: $stkPush) {
    description
    code
  }
}
`
export const MAKE_ADMIN = gql `
mutation MakeAdmin($operatorId: String) {
  makeAdmin(operatorId: $operatorId) {
    description
  }
}
`