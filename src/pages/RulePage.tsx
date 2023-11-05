import { useEffect } from "react";
import { Layout } from "../components/Layout";
import { useParams } from "react-router-dom";
import { Rule, RuleSet } from "../models/rule";
import {
  CDBContainer,
  CDBTable,
  CDBTableBody,
  CDBTableHeader,
  CDBIcon,
} from "cdbreact";
import { useUpdateState } from "../utils/hooks";
import { Header } from "../models/header";

export const RulePage = () => {
  const { id } = useParams();

  if (!id) {
    return "page not found";
  }

  const [rule, updateRule, setRule] = useUpdateState<Rule | null>(null);

  useEffect(() => {
    RuleSet.getInstance()
      .getRuleById(id)
      .then((data) => {
        setRule(data);
      });
  }, [id]);

  if (!rule) {
    return "rule not found";
  }

  return (
    <Layout
      title={rule.name}
      titleElement={
        <CDBContainer>
          <div className="d-flex">
            <input
              className="form-control"
              type="text"
              placeholder="Rule name"
              value={rule.name}
              onChange={(e) => {
                updateRule("name", e.target.value);
              }}
            />
            <button
              className="btn btn-primary btn-sm ml-1"
              onClick={() => {
                RuleSet.getInstance().saveRule(rule);
              }}
            >
              Save
            </button>
          </div>
        </CDBContainer>
      }
    >
      <CDBContainer>
        <h4>Headers</h4>
        <hr />
        <CDBTable small borderless>
          <CDBTableHeader>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Value</th>
            </tr>
          </CDBTableHeader>
          <CDBTableBody>
            {rule.headers.map((header, index) => {
              return (
                <tr key={`${index}`}>
                  <td>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={header.active}
                      onChange={(e) => {
                        updateRule(
                          `headers[${index}].active`,
                          e.target.checked,
                        );
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Header name"
                      value={header.name}
                      onChange={(e) => {
                        updateRule(`headers[${index}].name`, e.target.value);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      placeholder="Header value"
                      value={header.value}
                      onChange={(e) => {
                        updateRule(`headers[${index}].value`, e.target.value);
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </CDBTableBody>
          <tfoot>
            <tr>
              <td>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    const header = new Header();
                    updateRule(`headers[${rule.headers.length}]`, header);
                  }}
                >
                  <CDBIcon icon="plus" className="ms-1" />
                  Add new header
                </button>
              </td>
            </tr>
          </tfoot>
        </CDBTable>

        <h4>URL pattern</h4>
        <hr />

        <input
          type="text"
          placeholder="http://localhost:8080"
          value={rule.urlPattern}
          onChange={(e) => {
            updateRule(`urlPattern`, e.target.value);
          }}
        />
      </CDBContainer>
    </Layout>
  );
};
