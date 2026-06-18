import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

describe("PWA Configuration Conformance", () => {
  const publicDir = path.resolve(__dirname, "../../public");

  it("should have manifest.json with valid values", () => {
    const manifestPath = path.join(publicDir, "manifest.json");
    expect(fs.existsSync(manifestPath)).toBe(true);

    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    
    expect(manifest.name).toBe("JKH Opulence Studio");
    expect(manifest.short_name).toBe("JKH Opulence");
    expect(manifest.theme_color).toBe("#D4AF37");
    expect(manifest.background_color).toBe("#0B0B0B");
    expect(manifest.display).toBe("standalone");
    expect(manifest.orientation).toBe("portrait");
    expect(manifest.start_url).toBe("/");

    // Verify all PWA required icon sizes exist in manifest
    const iconSizes = manifest.icons.map((icon: any) => icon.sizes);
    const expectedSizes = ["72x72", "96x96", "128x128", "144x144", "152x152", "192x192", "384x384", "512x512"];
    expectedSizes.forEach(size => {
      expect(iconSizes).toContain(size);
    });
  });

  it("should have all generated icon images in public/icons/", () => {
    const iconsDir = path.join(publicDir, "icons");
    expect(fs.existsSync(iconsDir)).toBe(true);

    const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
    sizes.forEach(size => {
      const iconPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      expect(fs.existsSync(iconPath)).toBe(true);
    });

    // Verify favicon and apple touch icons exist
    expect(fs.existsSync(path.join(publicDir, "apple-touch-icon.png"))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, "favicon.png"))).toBe(true);
  });

  it("should have a valid, caching sw.js service worker", () => {
    const swPath = path.join(publicDir, "sw.js");
    expect(fs.existsSync(swPath)).toBe(true);

    const swContent = fs.readFileSync(swPath, "utf8");
    expect(swContent).toContain("jkh-opulence-cache-v1");
    expect(swContent).toContain("install");
    expect(swContent).toContain("activate");
    expect(swContent).toContain("fetch");
  });

  it("should have correct PWA and Apple tags in index.html", () => {
    const htmlPath = path.resolve(__dirname, "../../index.html");
    const htmlContent = fs.readFileSync(htmlPath, "utf8");

    // Title & Meta Name
    expect(htmlContent).toContain("<title>JKH Opulence Studio</title>");
    expect(htmlContent).toContain('name="apple-mobile-web-app-capable" content="yes"');
    expect(htmlContent).toContain('name="apple-mobile-web-app-status-bar-style" content="black-translucent"');
    expect(htmlContent).toContain('name="apple-mobile-web-app-title" content="JKH Opulence"');
    expect(htmlContent).toContain('href="/manifest.json"');
    expect(htmlContent).toContain('href="/apple-touch-icon.png"');
    expect(htmlContent).toContain('href="/favicon.png"');
  });
});
