"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../messages/en.json";
import hi from "../messages/hi.json";

export type Locale = "en" | "hi";
type Dictionary = typeof en;

const hindiLegacyCopy: Record<string, string> = {
  "The initiative": "पहल",
  "Explore opportunities": "अवसर देखें",
  "For organisations": "संगठनों के लिए",
  "Enter platform": "प्लेटफ़ॉर्म में जाएं",
  "Return home": "होम पर लौटें",
  "Workspace access": "वर्कस्पेस प्रवेश",
  "Opening your workspace...": "आपका वर्कस्पेस खुल रहा है...",
  "Loading workspace...": "वर्कस्पेस लोड हो रहा है...",
  "Something went wrong": "कुछ गलत हो गया",
  "This workspace could not load.": "यह वर्कस्पेस लोड नहीं हो सका।",
  "Student workspace": "विद्यार्थी वर्कस्पेस",
  "Institution workspace": "संस्थान वर्कस्पेस",
  "Employer workspace": "नियोक्ता वर्कस्पेस",
  "Mentor workspace": "मार्गदर्शक वर्कस्पेस",
  "Administrator workspace": "प्रशासक वर्कस्पेस",
  "Good morning,": "सुप्रभात,",
  "Review live competency metrics and close the highest-value skill gaps for your target AYUSH roles.":
    "अपने लक्ष्य आयुष कार्यों के लिए कौशल मेट्रिक्स की समीक्षा करें और महत्वपूर्ण कौशल अंतर भरें।",
  "Average proficiency": "औसत दक्षता",
  "Skills mapped": "मैप किए गए कौशल",
  "Verified evidence": "सत्यापित प्रमाण",
  "Skill-Gap Analysis": "कौशल-अंतर विश्लेषण",
  "Current capability vs taxonomy target":
    "वर्तमान क्षमता बनाम टैक्सोनॉमी लक्ष्य",
  "Application outcomes": "आवेदन परिणाम",
  "Explainable recommendations": "समझने योग्य सुझाव",
  "Opportunities matched to your evidence": "आपके प्रमाणों से मेल खाते अवसर",
  "Reference system": "संदर्भ प्रणाली",
  "Trust centre": "विश्वास केंद्र",
  "Project notebook": "प्रोजेक्ट नोटबुक",
  "System map": "सिस्टम मानचित्र",
  "Evidence to opportunity": "प्रमाण से अवसर तक",
  "Back to dashboard": "डैशबोर्ड पर वापस जाएं",
  "Back to employer workspace": "नियोक्ता वर्कस्पेस पर वापस जाएं",
  "Back to opportunities": "अवसरों पर वापस जाएं",
  "Post an opportunity": "अवसर पोस्ट करें",
  "Applicant review": "आवेदक समीक्षा",
  "Opportunity management": "अवसर प्रबंधन",
  "Your verified identity": "आपकी सत्यापित पहचान",
  "Skill passport": "कौशल पासपोर्ट",
  "Privacy at SkillSync": "SkillSync में गोपनीयता",
  "Accessibility statement": "सुलभता वक्तव्य",
  "Email address": "ईमेल पता",
  Password: "पासवर्ड",
  "Full name": "पूरा नाम",
  "Sign in": "साइन इन",
  "Create account": "खाता बनाएं",
  "Save changes": "परिवर्तन सहेजें",
  Cancel: "रद्द करें",
  Search: "खोजें",
  "Submit application": "आवेदन जमा करें",
  "View details": "विवरण देखें",
  "No results found": "कोई परिणाम नहीं मिला",
  Available: "उपलब्ध",
  Open: "खुला",
  Pending: "लंबित",
  Approved: "स्वीकृत",
  Rejected: "अस्वीकृत",
};

type LanguageContextValue = {
  locale: Locale;
  dictionary: Dictionary;
  toggleLocale: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("ayush_skillsync_locale");
    if (saved === "en" || saved === "hi") setLocale(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  useEffect(() => {
    const originals = new WeakMap<Text, string>();
    const attributeOriginals = new WeakMap<
      HTMLElement,
      Record<string, string>
    >();
    const translate = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
      );
      let node: Node | null;
      while ((node = walker.nextNode())) {
        const textNode = node as Text;
        const source = originals.get(textNode) || textNode.nodeValue || "";
        if (!originals.has(textNode)) originals.set(textNode, source);
        const translated =
          locale === "hi" ? hindiLegacyCopy[source.trim()] : source;
        if (translated && source.trim() === source)
          textNode.nodeValue = translated;
        else if (locale === "en") textNode.nodeValue = source;
      }
      document
        .querySelectorAll<HTMLElement>("[placeholder], [aria-label], [title]")
        .forEach((element) => {
          ["placeholder", "aria-label", "title"].forEach((attribute) => {
            const value = element.getAttribute(attribute);
            if (!value) return;
            const saved = attributeOriginals.get(element) || {};
            if (!saved[attribute]) saved[attribute] = value;
            attributeOriginals.set(element, saved);
            const translated =
              locale === "hi"
                ? hindiLegacyCopy[saved[attribute]]
                : saved[attribute];
            if (translated) element.setAttribute(attribute, translated);
          });
        });
    };
    translate();
    const observer = new MutationObserver(translate);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [locale]);

  function toggleLocale() {
    setLocale((current) => {
      const next = current === "en" ? "hi" : "en";
      window.localStorage.setItem("ayush_skillsync_locale", next);
      return next;
    });
  }

  const value = useMemo(
    () => ({ locale, dictionary: locale === "en" ? en : hi, toggleLocale }),
    [locale],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used inside LanguageProvider");
  return context;
}
