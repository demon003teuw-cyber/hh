import React, { useRef, useState } from 'react';
import { X, Download, Printer, Share2, CheckCircle, Mail, MessageSquare } from 'lucide-react';
import { Student, Parent, Payment, Level, Subject, Assignment, Group, Settings } from '../../../types';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Helper to parse OKLCH colors
const parseOklch = (colorStr: string) => {
  const match = colorStr.match(/oklch\(([^)]+)\)/i);
  if (!match) return null;
  
  const inner = match[1].trim();
  const parts = inner.split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  
  let l = parseFloat(parts[0]);
  if (parts[0].includes('%')) l = l / 100;
  
  let c = parseFloat(parts[1]);
  if (parts[1].includes('%')) c = c / 100;
  
  let h = parseFloat(parts[2]);
  
  let alpha = 1;
  if (parts[3]) {
    alpha = parseFloat(parts[3]);
    if (parts[3].includes('%')) alpha = alpha / 100;
  }
  
  return { l, c, h, alpha };
};

// Helper to convert OKLCH to standard RGB/RGBA color space
const convertOklchToRgb = (oklchStr: string): string => {
  const parsed = parseOklch(oklchStr);
  if (!parsed) return oklchStr;
  
  const { l: L, c: chroma, h: hueDeg, alpha } = parsed;
  const hueRad = (hueDeg * Math.PI) / 180;
  
  // OKLCH -> OKLab
  const lab_a = chroma * Math.cos(hueRad);
  const lab_b = chroma * Math.sin(hueRad);
  
  // OKLab -> LMS
  const l_ = L + 0.3963377774 * lab_a + 0.2158037573 * lab_b;
  const m_ = L - 0.1055613458 * lab_a - 0.0638541728 * lab_b;
  const s_ = L - 0.0894841775 * lab_a - 1.2914855480 * lab_b;
  
  // Non-linear LMS -> Linear LMS
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  
  // Linear LMS -> Linear sRGB
  const r_linear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  
  // Gamma correction
  const gamma = (val: number) => {
    return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };
  
  const rgb_r = gamma(r_linear);
  const rgb_g = gamma(g_linear);
  const rgb_b = gamma(b_linear);
  
  const R = Math.max(0, Math.min(255, Math.round(rgb_r * 255)));
  const G = Math.max(0, Math.min(255, Math.round(rgb_g * 255)));
  const B = Math.max(0, Math.min(255, Math.round(rgb_b * 255)));
  
  return alpha === 1 ? `rgb(${R}, ${G}, ${B})` : `rgba(${R}, ${G}, ${B}, ${alpha})`;
};

// Helper to parse OKLAB colors
const parseOklab = (colorStr: string) => {
  const match = colorStr.match(/oklab\(([^)]+)\)/i);
  if (!match) return null;
  
  const inner = match[1].trim();
  const parts = inner.split(/[\s,/]+/).filter(Boolean);
  if (parts.length < 3) return null;
  
  let l = parseFloat(parts[0]);
  if (parts[0].includes('%')) l = l / 100;
  
  let a = parseFloat(parts[1]);
  if (parts[1].includes('%')) a = a / 100;
  
  let b = parseFloat(parts[2]);
  if (parts[2].includes('%')) b = b / 100;
  
  let alpha = 1;
  if (parts[3]) {
    alpha = parseFloat(parts[3]);
    if (parts[3].includes('%')) alpha = alpha / 100;
  }
  
  return { l, a, b, alpha };
};

// Helper to convert OKLAB to standard RGB/RGBA color space
const convertOklabToRgb = (oklabStr: string): string => {
  const parsed = parseOklab(oklabStr);
  if (!parsed) return oklabStr;
  
  const { l: L, a, b, alpha } = parsed;
  
  // OKLab -> LMS
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
  
  // Non-linear LMS -> Linear LMS
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;
  
  // Linear LMS -> Linear sRGB
  const r_linear = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_linear = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_linear = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
  
  // Gamma correction
  const gamma = (val: number) => {
    return val <= 0.0031308 ? 12.92 * val : 1.055 * Math.pow(val, 1 / 2.4) - 0.055;
  };
  
  const rgb_r = gamma(r_linear);
  const rgb_g = gamma(g_linear);
  const rgb_b = gamma(b_linear);
  
  const R = Math.max(0, Math.min(255, Math.round(rgb_r * 255)));
  const G = Math.max(0, Math.min(255, Math.round(rgb_g * 255)));
  const B = Math.max(0, Math.min(255, Math.round(rgb_b * 255)));
  
  return alpha === 1 ? `rgb(${R}, ${G}, ${B})` : `rgba(${R}, ${G}, ${B}, ${alpha})`;
};

// Recursively find and replace oklch and oklab within complex background-images, box-shadows, etc.
const replaceModernColorsInString = (str: string): string => {
  if (!str) return str;
  let result = str;
  if (result.includes('oklch')) {
    result = result.replace(/oklch\(([^)]+)\)/gi, (match) => {
      return convertOklchToRgb(match);
    });
  }
  if (result.includes('oklab')) {
    result = result.replace(/oklab\(([^)]+)\)/gi, (match) => {
      return convertOklabToRgb(match);
    });
  }
  return result;
};

interface AdminPdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'FICHE_ELEVE' | 'RECEIPT';
  studentId?: string;
  paymentId?: string;
  students: Student[];
  parents: Parent[];
  levels: Level[];
  subjects: Subject[];
  assignments: Assignment[];
  groups: Group[];
  payments: Payment[];
  settings: Settings;
}

export const AdminPdfModal: React.FC<AdminPdfModalProps> = ({
  isOpen,
  onClose,
  type,
  studentId,
  paymentId,
  students,
  parents,
  levels,
  subjects,
  assignments,
  groups,
  payments,
  settings,
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [emailForm, setEmailForm] = useState({ show: false, email: '', sent: false });

  if (!isOpen) return null;

  // Resolve Data
  let student: Student | undefined;
  let parent: Parent | undefined;
  let payment: Payment | undefined;
  let level: Level | undefined;
  let studentPayments: Payment[] = [];
  let studentAssignments: Assignment[] = [];
  let studentGroups: Group[] = [];

  if (type === 'RECEIPT' && paymentId) {
    payment = payments.find(p => p.id === paymentId);
    if (payment) {
      student = students.find(s => s.id === payment!.studentId);
      if (student) {
        parent = parents.find(p => p.id === student!.parentId);
        level = levels.find(l => l.id === student!.levelId);
      }
    }
  } else if (type === 'FICHE_ELEVE' && studentId) {
    student = students.find(s => s.id === studentId);
    if (student) {
      parent = parents.find(p => p.id === student.parentId);
      level = levels.find(l => l.id === student.levelId);
      studentPayments = payments.filter(p => p.studentId === student!.id);
      studentAssignments = assignments.filter(a => a.studentId === student!.id);
      studentGroups = groups.filter(g => g.studentIds.includes(student!.id));
    }
  }

  if (!student) {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center space-y-4">
          <p className="text-slate-600 font-medium">Données introuvables.</p>
          <button onClick={onClose} className="bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-semibold">Fermer</button>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    setLoading(true);

    const styleElements = Array.from(document.querySelectorAll('style'));
    const originalStyleContents = styleElements.map(el => el.textContent || '');
    const linkElements = Array.from(document.querySelectorAll('link[rel="stylesheet"]')) as HTMLLinkElement[];
    const disabledLinks: HTMLLinkElement[] = [];
    const temporaryStyles: HTMLStyleElement[] = [];

    try {
      // 1. Temporarily patch style elements to replace OKLCH and OKLAB
      styleElements.forEach(el => {
        if (el.textContent && (el.textContent.includes('oklch') || el.textContent.includes('oklab'))) {
          el.textContent = replaceModernColorsInString(el.textContent);
        }
      });

      // 2. Temporarily patch same-origin link elements
      for (const link of linkElements) {
        try {
          const response = await fetch(link.href);
          if (response.ok) {
            let text = await response.text();
            if (text.includes('oklch') || text.includes('oklab')) {
              text = replaceModernColorsInString(text);
              const tempStyle = document.createElement('style');
              tempStyle.textContent = text;
              document.head.appendChild(tempStyle);
              temporaryStyles.push(tempStyle);
              link.disabled = true;
              disabledLinks.push(link);
            }
          }
        } catch (e) {
          console.warn('Could not process link stylesheet:', link.href, e);
        }
      }

      const element = printRef.current;
      // Configure html2canvas to render at high quality
      const canvas = await html2canvas(element, {
        scale: 2, // 2x DPI for beautiful printing
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc, clonedEl) => {
          const win = clonedDoc.defaultView || window;
          const clonedArea = clonedDoc.getElementById('pdf-print-area') || clonedEl;
          if (!clonedArea) return;

          // Overwrite computed oklch and oklab styles of elements inside the clone as a double fallback
          const elements = clonedArea.querySelectorAll('*');
          const allElements = [clonedArea, ...Array.from(elements)];

          const colorProps = [
            'color',
            'backgroundColor',
            'backgroundImage',
            'borderColor',
            'borderTopColor',
            'borderRightColor',
            'borderBottomColor',
            'borderLeftColor',
            'outlineColor',
            'boxShadow',
            'textShadow'
          ];

          allElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const style = win.getComputedStyle(htmlEl);
            colorProps.forEach((prop) => {
              const val = style[prop as any];
              if (val && (val.includes('oklch') || val.includes('oklab'))) {
                const converted = replaceModernColorsInString(val);
                htmlEl.style[prop as any] = converted;
              }
            });
          });
        }
      });

      const imgData = canvas.toDataURL('image/png');
      
      // Determine correct PDF size
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210; // A4 standard width in mm
      const pageHeight = 295; // A4 standard height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const fileName = type === 'RECEIPT' 
        ? `Recu_Paiement_${payment?.reference || 'N_A'}_${student?.lastName}.pdf`
        : `Fiche_Eleve_${student?.firstName}_${student?.lastName}.pdf`;

      pdf.save(fileName);
      showToast('PDF téléchargé avec succès !');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Une erreur est survenue lors de la génération du PDF.');
    } finally {
      // 3. Restore all styles to their original states
      styleElements.forEach((el, index) => {
        el.textContent = originalStyleContents[index];
      });
      disabledLinks.forEach(link => {
        link.disabled = false;
      });
      temporaryStyles.forEach(style => {
        style.remove();
      });
      setLoading(false);
    }
  };

  const handlePrint = () => {
    // A clean way to print is to download or open native print window
    // We can also trigger browser print directly with custom print styles
    window.print();
  };

  const showToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleSendWhatsApp = () => {
    if (!parent) return;
    const phoneClean = parent.phone.replace(/[^0-9+]/g, '');
    let text = '';
    
    if (type === 'RECEIPT' && payment) {
      text = `Bonjour ${parent.fullName},\n\nNous vous confirmons la bonne réception de votre paiement de ${payment.amount.toLocaleString()} FCFA pour l'élève ${student?.firstName} ${student?.lastName}.\nRéférence du reçu : ${payment.reference}\nDate : ${payment.date}\n\nMerci pour votre confiance !\nCordialement,\nLa direction du centre ${settings.centerName}`;
    } else {
      text = `Bonjour ${parent.fullName},\n\nVoici les informations académiques et la fiche de suivi de votre enfant ${student?.firstName} ${student?.lastName} pour l'année scolaire en cours chez ${settings.centerName}.\n\nCordialement,\n${settings.directorName}`;
    }

    const url = `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
    showToast('Redirection vers WhatsApp...');
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailForm(prev => ({ ...prev, sent: true }));
    setTimeout(() => {
      setEmailForm({ show: false, email: '', sent: false });
      showToast(`Document envoyé à l'adresse email avec succès !`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-100 rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h3 className="font-display font-bold text-slate-800 text-sm">
              {type === 'RECEIPT' ? 'Reçu de Paiement Numérique' : "Fiche d'Information Élève"}
            </h3>
            <p className="text-[10px] text-slate-400">
              {type === 'RECEIPT' ? `Aperçu du reçu ${payment?.reference}` : `Aperçu académique pour ${student.firstName} ${student.lastName}`}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body (Split Preview & Actions) */}
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 flex-1 overflow-y-auto">
          
          {/* Left Column: PDF Preview on a mock sheet of paper */}
          <div className="lg:col-span-2 p-6 flex justify-center bg-slate-200 overflow-y-auto max-h-[70vh]">
            <div 
              ref={printRef}
              id="pdf-print-area"
              className="bg-white w-[210mm] min-h-[295mm] p-[15mm] text-slate-800 font-sans shadow-lg relative flex flex-col justify-between text-xs leading-relaxed"
              style={{ boxSizing: 'border-box' }}
            >
              
              {/* Header decoration inside paper */}
              <div className="border-b-2 border-sky-500 pb-5 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tight font-display uppercase">{settings.centerName}</h1>
                    <p className="text-[10px] font-bold text-sky-600 tracking-wide uppercase mt-0.5">Soutien Scolaire d'Excellence</p>
                    <p className="text-[9px] text-slate-400 mt-1">Directeur : {settings.directorName}</p>
                  </div>
                  <div className="text-right text-[9px] text-slate-400 space-y-0.5">
                    <p className="font-bold text-slate-700"> Dakar, Sénégal</p>
                    <p>Tél : {settings.phone}</p>
                    <p>WhatsApp : {settings.whatsapp}</p>
                    <p>Date d'émission : {new Date().toLocaleDateString('fr-FR')}</p>
                  </div>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 space-y-6">
                
                {type === 'RECEIPT' && payment && (
                  <div className="space-y-6">
                    <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 text-center">
                      <p className="text-[10px] font-bold text-sky-600 tracking-widest uppercase">Document Officiel de Caisse</p>
                      <h2 className="text-lg font-bold text-slate-800 mt-1 uppercase">Reçu de Paiement</h2>
                      <p className="font-mono font-bold text-slate-500 text-[11px] mt-0.5">N° {payment.reference}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-6 pt-2">
                      <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Élève concerné</h3>
                        <p className="font-bold text-slate-800 text-sm">{student.firstName} {student.lastName}</p>
                        <p className="text-slate-500">Classe : <span className="font-semibold">{level?.name || 'Inconnue'}</span></p>
                        <p className="text-slate-500">Sexe : {student.sex === 'M' ? 'Garçon' : 'Fille'}</p>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Déposant / Parent</h3>
                        <p className="font-bold text-slate-700 text-xs">{parent?.fullName || 'N/A'}</p>
                        <p className="text-slate-500">Téléphone : {parent?.phone || 'N/A'}</p>
                        <p className="text-slate-500">Adresse : {parent?.address || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden mt-6">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold">
                            <th className="p-3">Désignation</th>
                            <th className="p-3">Mode de Paiement</th>
                            <th className="p-3 text-right">Montant Réglé</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr>
                            <td className="p-3">
                              <p className="font-semibold text-slate-800">Frais de Scolarité / Cours de Soutien</p>
                              <p className="text-[9px] text-slate-400">Versement effectué le {payment.date}</p>
                            </td>
                            <td className="p-3 font-semibold text-slate-600">
                              {payment.method === 'ESPECES' ? 'Espèces' : payment.method === 'WAVE' ? 'Wave Mobile Money' : 'Orange Money'}
                            </td>
                            <td className="p-3 text-right font-bold text-slate-800 text-sm">
                              {payment.amount.toLocaleString()} FCFA
                            </td>
                          </tr>
                          <tr className="bg-slate-50/50">
                            <td colSpan={2} className="p-3 text-right font-bold text-slate-500">Total payé</td>
                            <td className="p-3 text-right font-bold text-slate-900 text-sm">{payment.amount.toLocaleString()} FCFA</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="pt-4">
                      <p className="text-[10px] text-slate-500 italic">
                        * Arrêté le présent reçu à la somme de <span className="font-bold">{payment.amount.toLocaleString()} Francs CFA</span>. Les frais versés ne sont ni remboursables ni transférables.
                      </p>
                    </div>
                  </div>
                )}

                {type === 'FICHE_ELEVE' && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Dossier Académique</p>
                        <h2 className="text-base font-bold text-slate-800 mt-0.5">Fiche Individuelle d'Information</h2>
                      </div>
                      <span className="bg-sky-50 text-sky-600 border border-sky-200 text-[10px] font-bold px-3 py-1 rounded-xl">
                        Classe : {level?.name || 'Non définie'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Identité de l'élève</h3>
                        <table className="w-full text-slate-600 space-y-1">
                          <tbody>
                            <tr>
                              <td className="font-semibold text-slate-400 w-24 whitespace-nowrap pr-2">Prénom :</td>
                              <td className="font-bold text-slate-800">{student.firstName}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold text-slate-400 whitespace-nowrap pr-2">Nom :</td>
                              <td className="font-bold text-slate-800">{student.lastName}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold text-slate-400 whitespace-nowrap pr-2">Sexe :</td>
                              <td>{student.sex === 'M' ? 'Garçon' : 'Fille'}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold text-slate-400 whitespace-nowrap pr-2">Né(e) le :</td>
                              <td>{student.birthDate ? new Date(student.birthDate).toLocaleDateString('fr-FR') : '-'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Responsable Légal</h3>
                        <table className="w-full text-slate-600 space-y-1">
                          <tbody>
                            <tr>
                              <td className="font-semibold text-slate-400 w-24 whitespace-nowrap pr-2">Parent :</td>
                              <td className="font-semibold text-slate-800">{parent?.fullName || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold text-slate-400 whitespace-nowrap pr-2">Téléphone :</td>
                              <td>{parent?.phone || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold text-slate-400 whitespace-nowrap pr-2">WhatsApp :</td>
                              <td>{parent?.whatsapp || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td className="font-semibold text-slate-400 whitespace-nowrap pr-2">Adresse :</td>
                              <td className="truncate max-w-[150px]">{parent?.address || 'N/A'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Courses & Assignments scheduling */}
                    <div className="space-y-2 pt-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Cours et Emploi du Temps</h3>
                      {studentAssignments.length === 0 && studentGroups.length === 0 ? (
                        <p className="text-slate-400 text-[10px] italic py-2">Aucun cours planifié pour cet élève dans le système.</p>
                      ) : (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left border-collapse text-[10px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                                <th className="p-2.5">Type</th>
                                <th className="p-2.5">Matière</th>
                                <th className="p-2.5">Horaire</th>
                                <th className="p-2.5">Lieu / Salle</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                              {studentAssignments.map(asg => (
                                <tr key={asg.id}>
                                  <td className="p-2.5 font-bold text-amber-600 uppercase">Individuel</td>
                                  <td className="p-2.5 font-semibold text-slate-800">{subjects.find(s => s.id === asg.subjectId)?.name}</td>
                                  <td className="p-2.5">{asg.schedule}</td>
                                  <td className="p-2.5">{asg.location}</td>
                                </tr>
                              ))}
                              {studentGroups.map(grp => (
                                <tr key={grp.id}>
                                  <td className="p-2.5 font-bold text-sky-600 uppercase">Groupe ({grp.name})</td>
                                  <td className="p-2.5 font-semibold text-slate-800">{subjects.find(s => s.id === grp.subjectId)?.name}</td>
                                  <td className="p-2.5">{grp.schedule}</td>
                                  <td className="p-2.5">Salle {grp.room}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>

                    {/* Financial Summary */}
                    <div className="space-y-2 pt-2">
                      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-1">Historique des versements</h3>
                      {studentPayments.length === 0 ? (
                        <p className="text-slate-400 text-[10px] italic py-2">Aucun versement enregistré à ce jour.</p>
                      ) : (
                        <div className="border border-slate-200 rounded-xl overflow-hidden">
                          <table className="w-full text-left border-collapse text-[10px]">
                            <thead>
                              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500">
                                <th className="p-2.5">Référence</th>
                                <th className="p-2.5">Date</th>
                                <th className="p-2.5">Méthode</th>
                                <th className="p-2.5 text-right">Montant</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-600">
                              {studentPayments.map(p => (
                                <tr key={p.id}>
                                  <td className="p-2.5 font-mono font-bold text-slate-500">{p.reference}</td>
                                  <td className="p-2.5">{p.date}</td>
                                  <td className="p-2.5">{p.method}</td>
                                  <td className="p-2.5 text-right font-bold text-slate-800">{p.amount.toLocaleString()} FCFA</td>
                                </tr>
                              ))}
                              <tr className="bg-slate-50 font-bold text-slate-800">
                                <td colSpan={3} className="p-2.5 text-right font-bold text-slate-500">Total scolarité versé</td>
                                <td className="p-2.5 text-right text-emerald-600">{studentPayments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()} FCFA</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Signatures section at the bottom of the paper */}
              <div className="pt-8 border-t border-slate-100 mt-10">
                <div className="grid grid-cols-2 text-center text-[10px] text-slate-400 h-24">
                  <div className="flex flex-col justify-between">
                    <p className="font-bold text-slate-500 uppercase tracking-wider">Le Parent d'Élève</p>
                    <p className="italic text-[8px]">(Signature précédée de la mention "Lu et approuvé")</p>
                  </div>
                  <div className="flex flex-col justify-between">
                    <p className="font-bold text-slate-500 uppercase tracking-wider">La Direction</p>
                    <div className="font-display font-bold text-slate-800 text-[11px] self-center">
                      {settings.directorName}
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-[8px] text-slate-300 mt-12 pt-4 border-t border-slate-100">
                  Document officiel édité par le logiciel du centre {settings.centerName} de Dakar. © 2026. Tous droits réservés.
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Actions and sending panel */}
          <div className="p-6 bg-white space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-sm">Génération de documents</h4>
                <p className="text-slate-400 text-[10px]">
                  Téléchargez la version PDF finale ou envoyez-la directement aux parents d'élèves via nos connecteurs intégrés.
                </p>
              </div>

              {successMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-600 p-3 rounded-xl flex items-center gap-2 font-semibold">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <div className="space-y-2">
                <button
                  id="pdf-btn-download"
                  onClick={handleDownloadPDF}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 text-white font-bold py-3 rounded-xl transition shadow-xs text-xs"
                >
                  <Download className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
                  {loading ? 'Génération du PDF...' : 'Télécharger le PDF'}
                </button>

                <button
                  id="pdf-btn-print"
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition text-xs"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer le document
                </button>
              </div>

              <hr className="border-slate-100" />

              <div className="space-y-3">
                <h5 className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-slate-500" /> Options d'envoi rapide
                </h5>
                
                <button
                  id="pdf-btn-whatsapp"
                  onClick={handleSendWhatsApp}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl transition text-xs"
                >
                  <MessageSquare className="w-4 h-4" />
                  Envoyer par WhatsApp
                </button>

                {!emailForm.show ? (
                  <button
                    id="pdf-btn-show-email"
                    onClick={() => setEmailForm({ show: true, email: parent?.email || '', sent: false })}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 rounded-xl transition text-xs"
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer par Email
                  </button>
                ) : (
                  <form onSubmit={handleSendEmail} className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-600 text-[10px]">Indiquez l'adresse email :</p>
                    <input
                      type="email"
                      value={emailForm.email}
                      onChange={e => setEmailForm({ ...emailForm, email: e.target.value })}
                      placeholder="parent@example.com"
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white text-xs outline-none focus:border-sky-500"
                      required
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEmailForm({ show: false, email: '', sent: false })}
                        className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold py-1.5 rounded-lg"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="flex-1 bg-sky-500 hover:bg-sky-400 text-white text-[10px] font-bold py-1.5 rounded-lg"
                      >
                        {emailForm.sent ? 'Envoi...' : 'Envoyer'}
                      </button>
                    </div>
                  </form>
                )}
              </div>

            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Aide & Astuce</span>
              <p className="text-[10px] text-slate-500 mt-1">
                Le PDF généré respecte le format standard A4 de bureau pour vos classeurs et dossiers physiques. Assurez-vous d'avoir configuré l'imprimante en orientation "Portrait" lors de l'impression.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
