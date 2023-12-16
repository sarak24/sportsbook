import React from "react";

import style from "./tracking.module.scss";
import AccountDetail from "../../components/account-detail";

const UserProfile = () => {
  return (
    <div className={style.container}>
      <div className={style.accountDiv}>
        <div className={style.accText}>
          <h1>Account</h1>
          <span>Member since 2021</span>
        </div>
      </div>

      {allData?.map(({ title, credentials, customizedData }, i) => {
        return (
          <AccountDetail
            title={title}
            credentials={credentials}
            customizedData={customizedData}
          />
        );
      })}
    </div>
  );
};

export default UserProfile;

const allData = [
  {
    title: "MEMBERSHIP AND BILLING",
    credentials: [
      { title: "Email: example.gmail.com" },
      { title: "Password: ********" },
      { title: "Phone: (111)-111-1111" },
    ],
    customizedData: [
      { title: "Change Account Email" },
      { title: "Change Password" },
      { title: "Change Phone Number" },
    ],
  },
  {
    title: "SECURITY & PRIVACY",
    credentials: [
      { title: "Control access to this account, see where you're logged in." },
    ],
    customizedData: [
      { title: "Manage Devices" },
      { title: "Sign out off all devices" },
    ],
  },
  {
    title: "INFORMATION",
    credentials: [{ title: "View and manage your data." }],
    customizedData: [{ title: "Manage Data" }, { title: "Delete all Data" }],
  },
  {
    title: "SOCIAL ACTIVITY",
    credentials: [{ title: "View and manage your social activity." }],
    customizedData: [
      { title: "Manage Activity" },
      { title: "Delete all Activity" },
      { title: "Activity Settings" },
    ],
  },
];
