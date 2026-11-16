import { readFileSync } from "node:fs";
import { expect, it } from "vitest";

const luminance = (hex) => hex.match(/[0-9a-f]{2}/gi).map((c) => parseInt(c, 16) / 255).map((v) => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((sum, v, i) => sum + v * [.2126, .7152, .0722][i], 0);
it("scopes legacy breadcrumb tokens to shell semantic colors with readable light contrast", () => {
  const css = readFileSync("src/styles/gaeva-shell.css", "utf8");
  const block = css.match(/\.gaeva-module-surface > nav\[aria-label="Caminho de navegação"\]\s*\{([^}]+)\}/)?.[1];
  expect(block).toContain("--text-primary: var(--gaeva-ink)");
  expect(block).toContain("--text-secondary: var(--gaeva-muted)");
  expect(block).toContain("--text-muted: var(--gaeva-muted)");
  const initial = css.slice(0, css.indexOf(".gaeva-sidebar"));
  const color = (name) => initial.match(new RegExp(`--gaeva-${name}:\\s*(#[0-9a-f]{6})`, "i"))[1];
  for (const name of ["ink", "muted"]) {
    const values = [luminance(color(name)), luminance(color("background"))].sort((a, b) => b - a);
    expect((values[0] + .05) / (values[1] + .05)).toBeGreaterThanOrEqual(4.5);
  }
});
