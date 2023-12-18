import { customTemplate } from "../utils/common";

export class Header {
  constructor(
    public name = "",
    public value = "",
    public active = true,
  ) {}

  getCompiledName(vars?: {}) {
    return vars ? customTemplate(this.name, vars) : this.name;
  }

  getCompiledValue(vars?: {}) {
    return vars ? customTemplate(this.value, vars) : this.value;
  }
}
