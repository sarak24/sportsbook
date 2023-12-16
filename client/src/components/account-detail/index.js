import React from "react";

import style from "./detail.module.scss";

const AccountDetail = ({ title, credentials, customizedData }) => {
  return (
    <div className={style.container}>
      <div className={style.child1}>{title}</div>
      <div className={style.child2}>
        {credentials?.map((data, i) => {
          return <p key={i}>{data?.title}</p>;
        })}
      </div>
      <div className={style.child3}>
        {customizedData?.map((data, i) => {
          return <p key={i}>{data?.title}</p>;
        })}
      </div>
    </div>
  );
};

export default AccountDetail;
