import { roleHome, roleLabel } from "../components/auth-context";

describe("authenticated role routing", () => {
  test.each([
    ["student", "/dashboard/student"],
    ["institution", "/dashboard/institution"],
    ["employer", "/dashboard/employer"],
    ["mentor", "/dashboard/mentor"],
    ["admin", "/dashboard/admin"],
  ])("maps %s to its workspace", (role, expected) => {
    expect(roleHome(role as Parameters<typeof roleHome>[0])).toBe(expected);
  });

  test("formats role labels for account controls", () => {
    expect(roleLabel("institution")).toBe("Institution");
    expect(roleLabel(undefined)).toBe("Guest");
  });
});