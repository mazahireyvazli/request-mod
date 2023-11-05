import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
  CDBBtn,
  CDBIcon,
} from "cdbreact";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Rule, RuleSet } from "../models/rule";

export const Sidebar = () => {
  const location = useLocation();

  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    RuleSet.getInstance()
      .getRules()
      .then((data) => {
        setRules(data);
      });
  }, [location]);

  return (
    <CDBSidebar
      toggled={false}
      className="sidebar"
      textColor="#fff"
      backgroundColor="#333"
      breakpoint={720}
      minWidth="80px"
      maxWidth="360px"
    >
      <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
        <a
          href="/"
          className="text-decoration-none"
          style={{ color: "inherit" }}
        >
          Rules
        </a>
      </CDBSidebarHeader>

      <CDBSidebarContent className="sidebar-content">
        <CDBSidebarMenu>
          {rules.map((rule) => {
            return (
              <Link key={rule.id} to={`/rules/${rule.id}`}>
                <CDBSidebarMenuItem key={rule.id} icon="minus">
                  {rule.name}
                </CDBSidebarMenuItem>
              </Link>
            );
          })}
          <hr />

          <CDBSidebarMenuItem>
            <Link to="/rules/create">
              <CDBBtn color="primary">
                <CDBIcon icon="plus" className="ms-1" />
                Add new rule
              </CDBBtn>
            </Link>
          </CDBSidebarMenuItem>
        </CDBSidebarMenu>
      </CDBSidebarContent>

      <CDBSidebarFooter>
        <div
          style={{
            padding: "20px 5px",
            textAlign: "center",
          }}
        >
          Project page
        </div>
      </CDBSidebarFooter>
    </CDBSidebar>
  );
};
