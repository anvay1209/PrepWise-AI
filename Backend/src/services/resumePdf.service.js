const PDFDocument = require("pdfkit");

function normalizeTextValue(value) {
  return value ? String(value).trim() : "";
}

function renderHeading(doc, title) {
  doc.moveDown(0.4);
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#111827").text(title, { characterSpacing: 0.4 });
  doc.moveDown(0.08);
  const lineEnd = doc.page.width - doc.page.margins.right;
  doc.strokeColor("#111827").lineWidth(1).moveTo(doc.x, doc.y).lineTo(lineEnd, doc.y).stroke();
  doc.moveDown(0.45);
}

function renderParagraph(doc, text) {
  doc.font("Helvetica").fontSize(11).fillColor("#111827").text(text, {
    lineGap: 3,
  });
  doc.moveDown(0.4);
}

function renderBulletList(doc, bullets = []) {
  bullets.forEach((bullet) => {
    doc.font("Helvetica").fontSize(11).fillColor("#111827").text(`• ${bullet}`, {
      indent: 14,
      lineGap: 2,
      paragraphGap: 2,
    });
  });
  if (bullets.length) {
    doc.moveDown(0.2);
  }
}

function renderSectionList(doc, title, items) {
  if (!Array.isArray(items) || items.length === 0) {
    return;
  }

  renderHeading(doc, title);
  items.forEach((item) => {
    if (!item || typeof item !== "string") return;
    doc.font("Helvetica").fontSize(11).fillColor("#111827").text(item, {
      lineGap: 3,
    });
  });
}

function renderSkillGroups(doc, skills = {}) {
  const categories = [
    { key: "programmingLanguages", label: "Programming Languages" },
    { key: "frontend", label: "Frontend" },
    { key: "backend", label: "Backend" },
    { key: "databases", label: "Databases" },
    { key: "cloud", label: "Cloud" },
    { key: "devOps", label: "DevOps" },
    { key: "machineLearning", label: "Machine Learning" },
    { key: "ai", label: "AI" },
    { key: "tools", label: "Tools" },
    { key: "softSkills", label: "Soft Skills" },
  ];

  const rows = categories
    .map((section) => {
      const values = Array.isArray(skills[section.key]) ? skills[section.key].filter(Boolean) : [];
      return values.length ? `${section.label}: ${values.join(", ")}` : null;
    })
    .filter(Boolean);

  if (!rows.length) return;

  renderHeading(doc, "Key Skills");
  rows.forEach((line) => {
    doc.font("Helvetica").fontSize(11).fillColor("#111827").text(line, {
      lineGap: 3,
    });
  });
}

function renderExperienceItems(doc, items) {
  if (!Array.isArray(items) || items.length === 0) return;

  renderHeading(doc, "Professional Experience");

  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const title = normalizeTextValue(item.title);
    const company = normalizeTextValue(item.company);
    const location = normalizeTextValue(item.location);
    const dateRange = normalizeTextValue(item.dateRange || item.duration);
    const headline = [title, company].filter(Boolean).join(" | ");
    if (headline) {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(headline);
    }

    const subline = [location, dateRange].filter(Boolean).join(" • ");
    if (subline) {
      doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(subline);
    }

    const achievements = Array.isArray(item.accomplishments) ? item.accomplishments : item.bullets || [];
    renderBulletList(doc, achievements.map(String).filter((text) => text.trim()));
    doc.moveDown(0.15);
  });
}

function renderProjectItems(doc, items) {
  if (!Array.isArray(items) || items.length === 0) return;

  renderHeading(doc, "Projects");

  items.forEach((project) => {
    if (!project || typeof project !== "object") return;
    const name = normalizeTextValue(project.name || project.title);
    const description = normalizeTextValue(project.description || project.summary);
    const technologies = Array.isArray(project.technologies) ? project.technologies : [];

    if (name) {
      doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(name);
    }
    if (description) {
      doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(description, { lineGap: 3 });
    }
    if (technologies.length) {
      doc.font("Helvetica").fontSize(10).fillColor("#111827").text(`Tech: ${technologies.join(", ")}`, {
        lineGap: 3,
      });
    }

    const achievements = Array.isArray(project.achievements) ? project.achievements : project.bullets || [];
    renderBulletList(doc, achievements.map(String).filter((text) => text.trim()));
    doc.moveDown(0.2);
  });
}

function renderSimpleItems(doc, title, items) {
  if (!Array.isArray(items) || items.length === 0) return;
  renderHeading(doc, title);
  renderBulletList(doc, items.map(String).filter((text) => text.trim()));
}

function createResumePdf(resumeData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", reject);

    let parsedData = resumeData;
    if (typeof resumeData === "string") {
      try {
        parsedData = JSON.parse(resumeData);
      } catch (error) {
        parsedData = null;
      }
    }

    if (parsedData && typeof parsedData === "object" && !Array.isArray(parsedData)) {
      const personalInformation = parsedData.personalInformation || {};
      const fullName = normalizeTextValue(personalInformation.fullName || personalInformation.name || "AI Generated Resume");
      const professionalTitle = normalizeTextValue(personalInformation.professionalTitle || parsedData.resumeMetadata?.targetRole || "");

      const contactParts = [
        normalizeTextValue(personalInformation.email),
        normalizeTextValue(personalInformation.phone),
        normalizeTextValue(personalInformation.location),
        normalizeTextValue(personalInformation.linkedIn),
        normalizeTextValue(personalInformation.github),
        normalizeTextValue(personalInformation.portfolio),
        normalizeTextValue(personalInformation.website),
      ].filter(Boolean);

      doc.font("Helvetica-Bold").fontSize(26).fillColor("#111827").text(fullName);
      doc.moveDown(0.15);

      if (professionalTitle) {
        doc.font("Helvetica").fontSize(12).fillColor("#4b5563").text(professionalTitle);
      }

      if (contactParts.length) {
        doc.moveDown(0.15);
        doc.font("Helvetica").fontSize(10).fillColor("#6b7280").text(contactParts.join(" | "), {
          lineGap: 2,
        });
      }

      doc.moveDown(0.6);
      const lineEnd = doc.page.width - doc.page.margins.right;
      doc.strokeColor("#111827").lineWidth(1).moveTo(doc.x, doc.y).lineTo(lineEnd, doc.y).stroke();
      doc.moveDown(0.8);

      if (normalizeTextValue(parsedData.professionalSummary)) {
        renderHeading(doc, "Professional Summary");
        renderParagraph(doc, normalizeTextValue(parsedData.professionalSummary));
      }

      renderSkillGroups(doc, parsedData.skills || {});
      renderExperienceItems(doc, parsedData.experience || []);
      renderProjectItems(doc, parsedData.projects || []);
      renderSimpleItems(doc, "Education", parsedData.education || []);
      renderSimpleItems(doc, "Certifications", parsedData.certifications || []);
      renderSimpleItems(doc, "Achievements", parsedData.achievements || []);
      renderSimpleItems(doc, "Leadership", parsedData.leadership || []);
      renderSimpleItems(doc, "Volunteer Experience", parsedData.volunteerExperience || []);
      renderSimpleItems(doc, "Publications", parsedData.publications || []);
      renderSimpleItems(doc, "Languages", parsedData.languages || []);
      renderSimpleItems(doc, "Coding Profiles", parsedData.codingProfiles || []);

      if (Array.isArray(parsedData.additionalSections) && parsedData.additionalSections.length) {
        parsedData.additionalSections.forEach((section) => {
          if (!section || typeof section !== "object") return;
          const heading = normalizeTextValue(section.heading || section.title || "");
          const content = Array.isArray(section.content)
            ? section.content.map(String).filter((line) => line.trim()).join("\n")
            : normalizeTextValue(section.content || section.text || "");
          if (heading) {
            renderHeading(doc, heading);
          }
          if (content) {
            renderParagraph(doc, content);
          }
        });
      }

      if (doc.bufferedPageRange().count === 0) {
        renderParagraph(doc, "AI-generated resume content unavailable.");
      }
    } else {
      const lines = String(resumeData || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      const name = lines[0] || "AI Generated Resume";
      const headline = lines[1] || "Resume created by PrepWise AI";
      const contact = lines.slice(2, 4).join(" • ");

      doc.font("Helvetica-Bold").fontSize(26).fillColor("#111827").text(name);
      doc.moveDown(0.15);
      if (headline) {
        doc.font("Helvetica").fontSize(12).fillColor("#4b5563").text(headline);
      }
      if (contact) {
        doc.moveDown(0.15);
        doc.font("Helvetica").fontSize(10).fillColor("#6b7280").text(contact, {
          lineGap: 2,
        });
      }
      doc.moveDown(0.6);
      const lineEnd = doc.page.width - doc.page.margins.right;
      doc.strokeColor("#111827").lineWidth(1).moveTo(doc.x, doc.y).lineTo(lineEnd, doc.y).stroke();
      doc.moveDown(0.8);

      lines.slice(4).forEach((line) => {
        if (/^[-*•]\s+/.test(line)) {
          doc.font("Helvetica").fontSize(11).fillColor("#111827").text(`• ${line.replace(/^[-*•]\s+/, "")}`, {
            indent: 14,
            lineGap: 2,
          });
        } else {
          doc.font("Helvetica").fontSize(11).fillColor("#111827").text(line, {
            lineGap: 3,
          });
        }
        doc.moveDown(0.1);
      });
    }

    doc.end();
  });
}

module.exports = { createResumePdf };
