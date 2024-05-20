import { gql } from "@apollo/client";

export const GET_ORGANIZATIONS_LIST = gql`
query {
  organizationsList {
    name
    id
    departments {
      smsBalance
    }
    operators {
      name
    }
  }

}
`;

export const ORGANIZATION_DETAILS = gql`
query OrganizationDetails($organizationDetailsId: String) {
  organizationDetails(id: $organizationDetailsId) {
    name
    id
  }
}`;

export const GET_OPERATORS_LIST = gql`
query OperatorsList($organizationId: String) {
  operatorsList(organizationId: $organizationId) {
    departments {
     name
    }
    id
    name
    phoneNumber
  }
}
`;

export const GET_DEPARTMENT_LIST = gql`
query DepartmentsList($organizationId: String) {
  departmentsList(organizationId: $organizationId) {
    id
    name
    senderName
    smsBalance
   
  }
}
`;

export const GET_CONTACT_LIST = gql`
query ContactsList($organizationId: String) {
  contactsList(organizationId: $organizationId) {
    name
  }
}`

export const GET_ALL_ROOMS = gql`
query GetAllRooms($roomParams: RoomParams!) {
  getAllRooms(roomParams: $roomParams) {
    contacts {
      id
      name
    }
    messages {
      content
    }
  }
}
`

export const GET_ALL_ROOMS_MESSAGES = gql`
query GetAllRooms($roomParams: RoomParams!) {
  getAllRooms(roomParams: $roomParams) {
    messages {
      content
      timeStamp
    }
    contacts {
      name
    }
  }
}
`