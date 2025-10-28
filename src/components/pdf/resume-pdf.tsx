import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';
import type { Resume } from '@/types/resume';

interface ResumePDFProps {
  resume: Resume;
}

// Estilos para el PDF
const createStyles = (design: Resume['design']) => {
  const colorSchemes = {
    blue: { primary: '#3B82F6', light: '#DBEAFE', dark: '#1E40AF' },
    green: { primary: '#10B981', light: '#D1FAE5', dark: '#047857' },
    purple: { primary: '#8B5CF6', light: '#EDE9FE', dark: '#6D28D9' },
    red: { primary: '#EF4444', light: '#FEE2E2', dark: '#B91C1C' },
    gray: { primary: '#6B7280', light: '#F3F4F6', dark: '#374151' },
  };

  const colorScheme = colorSchemes[design?.colorScheme as keyof typeof colorSchemes] || colorSchemes.blue;
  const fontSize = design?.fontSize || 11;
  const spacing = design?.spacing === 'compact' ? 8 : design?.spacing === 'relaxed' ? 16 : 12;

  return StyleSheet.create({
    page: {
      padding: 40,
      fontSize: fontSize,
      fontFamily: 'Helvetica',
      backgroundColor: '#ffffff',
    },
    header: {
      marginBottom: spacing * 2,
      textAlign: 'center',
    },
    name: {
      fontSize: fontSize + 12,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#111827',
    },
    contactInfo: {
      fontSize: fontSize - 1,
      color: '#6B7280',
      marginBottom: 4,
    },
    links: {
      fontSize: fontSize - 1,
      color: colorScheme.primary,
      marginTop: 4,
    },
    section: {
      marginBottom: spacing,
    },
    sectionTitle: {
      fontSize: fontSize + 2,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 8,
      paddingBottom: 4,
      borderBottomWidth: 2,
      borderBottomColor: colorScheme.primary,
    },
    itemContainer: {
      marginBottom: spacing - 2,
    },
    itemTitle: {
      fontSize: fontSize,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 2,
    },
    itemSubtitle: {
      fontSize: fontSize - 1,
      color: '#6B7280',
      marginBottom: 4,
    },
    itemDescription: {
      fontSize: fontSize - 1,
      color: '#374151',
      lineHeight: 1.5,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
    },
    skillBadge: {
      backgroundColor: colorScheme.light,
      color: colorScheme.dark,
      padding: '4 8',
      borderRadius: 4,
      fontSize: fontSize - 2,
      fontWeight: 'medium',
    },
    twoColumnContainer: {
      flexDirection: 'row',
      gap: 16,
    },
    mainColumn: {
      flex: 2,
    },
    sideColumn: {
      flex: 1,
    },
    sidebarSection: {
      marginBottom: spacing,
    },
    sidebarTitle: {
      fontSize: fontSize - 1,
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: 6,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sidebarItem: {
      fontSize: fontSize - 2,
      color: '#374151',
      marginBottom: 3,
    },
  });
};

export function ResumePDF({ resume }: ResumePDFProps) {
  const styles = createStyles(resume.design);
  const layout = resume.design?.layout || 'single-column';
  const personalInfo = resume.personalInfo || {};

  // Renderizar layout de una columna
  const renderSingleColumn = () => (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{personalInfo.fullName || 'Tu Nombre'}</Text>
        <Text style={styles.contactInfo}>
          {[
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
          ]
            .filter(Boolean)
            .join(' • ')}
        </Text>
        {(personalInfo.website || personalInfo.linkedin || personalInfo.github) && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 4 }}>
            {personalInfo.website && (
              <>
                <Link src={personalInfo.website} style={styles.links}>
                  Sitio Web
                </Link>
                {(personalInfo.linkedin || personalInfo.github) && <Text style={styles.links}>•</Text>}
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <Link src={personalInfo.linkedin} style={styles.links}>
                  LinkedIn
                </Link>
                {personalInfo.github && <Text style={styles.links}>•</Text>}
              </>
            )}
            {personalInfo.github && (
              <Link src={personalInfo.github} style={styles.links}>
                GitHub
              </Link>
            )}
          </View>
        )}
      </View>

      {/* Summary */}
      {personalInfo.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <Text style={styles.itemDescription}>{personalInfo.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {resume.sectionVisibility.experience && resume.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
          {resume.experience.map((exp) => (
            <View key={exp.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{exp.position}</Text>
              <Text style={styles.itemSubtitle}>
                {exp.company} • {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                {exp.location && ` • ${exp.location}`}
              </Text>
              <Text style={styles.itemDescription}>{exp.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {resume.sectionVisibility.education && resume.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Educación</Text>
          {resume.education.map((edu) => (
            <View key={edu.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>
                {edu.degree} en {edu.field}
              </Text>
              <Text style={styles.itemSubtitle}>
                {edu.institution}
                {edu.startDate && ` • ${edu.startDate}`}
                {edu.endDate && ` - ${edu.endDate}`}
                {edu.location && ` • ${edu.location}`}
              </Text>
              {edu.gpa && <Text style={styles.itemDescription}>GPA: {edu.gpa}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {resume.sectionVisibility.skills && resume.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Habilidades</Text>
          <View style={styles.skillsContainer}>
            {resume.skills.map((skill) => (
              <Text key={skill.id} style={styles.skillBadge}>
                {skill.name}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Projects */}
      {resume.sectionVisibility.projects && resume.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Proyectos</Text>
          {resume.projects.map((project) => (
            <View key={project.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{project.name}</Text>
              {(project.url || project.github) && (
                <View style={{ flexDirection: 'row', gap: 8, marginBottom: 4 }}>
                  {project.url && (
                    <>
                      <Link src={project.url} style={styles.itemSubtitle}>
                        Ver Proyecto
                      </Link>
                      {project.github && <Text style={styles.itemSubtitle}>•</Text>}
                    </>
                  )}
                  {project.github && (
                    <Link src={project.github} style={styles.itemSubtitle}>
                      GitHub
                    </Link>
                  )}
                </View>
              )}
              <Text style={styles.itemDescription}>{project.description}</Text>
              {project.technologies && project.technologies.length > 0 && (
                <Text style={styles.itemSubtitle}>
                  Tecnologías: {project.technologies.join(', ')}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Certifications */}
      {resume.sectionVisibility.certifications && resume.certifications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Certificaciones</Text>
          {resume.certifications.map((cert) => (
            <View key={cert.id} style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{cert.name}</Text>
              <Text style={styles.itemSubtitle}>
                {cert.issuer} • {cert.date}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Languages */}
      {resume.sectionVisibility.languages && resume.languages.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Idiomas</Text>
          {resume.languages.map((lang) => (
            <Text key={lang.id} style={styles.sidebarItem}>
              {lang.language} - {lang.proficiency}
            </Text>
          ))}
        </View>
      )}
    </Page>
  );

  // Renderizar layout de dos columnas
  const renderTwoColumn = () => (
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{resume.personalInfo.fullName || 'Tu Nombre'}</Text>
        <Text style={styles.contactInfo}>
          {[resume.personalInfo.email, resume.personalInfo.phone, resume.personalInfo.location]
            .filter(Boolean)
            .join(' • ')}
        </Text>
      </View>

      <View style={styles.twoColumnContainer}>
        {/* Main Column */}
        <View style={styles.mainColumn}>
          {/* Experience */}
          {resume.sectionVisibility.experience && resume.experience.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Experiencia</Text>
              {resume.experience.map((exp) => (
                <View key={exp.id} style={styles.itemContainer}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemSubtitle}>
                    {exp.company} • {exp.startDate} - {exp.current ? 'Presente' : exp.endDate}
                  </Text>
                  <Text style={styles.itemDescription}>{exp.description}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Education */}
          {resume.sectionVisibility.education && resume.education.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Educación</Text>
              {resume.education.map((edu) => (
                <View key={edu.id} style={styles.itemContainer}>
                  <Text style={styles.itemTitle}>
                    {edu.degree} en {edu.field}
                  </Text>
                  <Text style={styles.itemSubtitle}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Side Column */}
        <View style={styles.sideColumn}>
          {/* Links */}
          {(resume.personalInfo.website || resume.personalInfo.linkedin || resume.personalInfo.github) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Enlaces</Text>
              {resume.personalInfo.website && (
                <Link src={resume.personalInfo.website} style={styles.sidebarItem}>
                  Sitio Web
                </Link>
              )}
              {resume.personalInfo.linkedin && (
                <Link src={resume.personalInfo.linkedin} style={styles.sidebarItem}>
                  LinkedIn
                </Link>
              )}
              {resume.personalInfo.github && (
                <Link src={resume.personalInfo.github} style={styles.sidebarItem}>
                  GitHub
                </Link>
              )}
            </View>
          )}

          {/* Skills */}
          {resume.sectionVisibility.skills && resume.skills.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Habilidades</Text>
              {resume.skills.map((skill) => (
                <Text key={skill.id} style={styles.sidebarItem}>
                  • {skill.name}
                </Text>
              ))}
            </View>
          )}

          {/* Languages */}
          {resume.sectionVisibility.languages && resume.languages.length > 0 && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Idiomas</Text>
              {resume.languages.map((lang) => (
                <Text key={lang.id} style={styles.sidebarItem}>
                  {lang.language} ({lang.proficiency})
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>
    </Page>
  );

  return (
    <Document>
      {layout === 'two-column' ? renderTwoColumn() : renderSingleColumn()}
    </Document>
  );
}
