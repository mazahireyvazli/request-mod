import { CDBInput, CDBBtn, CDBContainer } from "cdbreact";
import React, { useState } from "react";
import { RuleSet } from "../models/rule";
import { useNavigate } from "react-router-dom";

export const CreateRuleForm = () => {
  const navigate = useNavigate();

  const [ruleName, setRuleName] = useState("");

  return (
    <CDBContainer>
      <CDBInput
        material
        type="text"
        value={ruleName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setRuleName(e.target.value);
        }}
      />

      <CDBBtn
        color="dark"
        className="btn-block my-3 mx-0"
        onClick={() => {
          RuleSet.getInstance()
            .createRule(ruleName)
            .then((id) => {
              console.log("rule id", id);
              navigate(`/rules/${id}`);
            });
        }}
      >
        Save rule
      </CDBBtn>
    </CDBContainer>
  );
};
