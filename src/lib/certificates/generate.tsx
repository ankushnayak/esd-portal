import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils/format";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    color: "#11284c",
    backgroundColor: "#fffdf7",
  },
  brand: {
    marginBottom: 18,
    fontSize: 14,
    color: "#1e3a8a",
  },
  title: {
    fontSize: 28,
    marginBottom: 6,
    color: "#123873",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 28,
    color: "#47617c",
  },
  panel: {
    border: "1 solid #d7dde7",
    borderRadius: 12,
    padding: 24,
    gap: 8,
  },
  emphasis: {
    fontSize: 18,
    color: "#13795b",
  },
  footer: {
    marginTop: 24,
    fontSize: 10,
    color: "#5a697f",
  },
});

type CertificateDocumentProps = {
  alumniName: string;
  periodLabel: string;
  totalCases: number;
  totalValue: number;
  beneficiariesHelped: number;
  certificateNumber: string;
  issueDate: Date;
};

export function CertificateDocument(props: CertificateDocumentProps) {
  return (
    <Document title={`Expert Seva Diwas - ${props.certificateNumber}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>EXPERT Alumni | Expert Group of Institutions Alumni Network</Text>
        <Text style={styles.title}>Expert Seva Diwas Recognition Certificate</Text>
        <Text style={styles.subtitle}>
          This certificate recognizes the verified seva contribution made through the Expert Seva Diwas initiative.
        </Text>

        <View style={styles.panel}>
          <Text>This is proudly presented to</Text>
          <Text style={styles.emphasis}>{props.alumniName}</Text>
          <Text>For the contribution period: {props.periodLabel}</Text>
          <Text>Total approved seva cases: {props.totalCases}</Text>
          <Text>Total seva value: {formatCurrency(props.totalValue)}</Text>
          <Text>Total beneficiaries helped: {props.beneficiariesHelped}</Text>
          <Text>Certificate number: {props.certificateNumber}</Text>
          <Text>Issue date: {format(props.issueDate, "dd MMM yyyy")}</Text>
        </View>

        <Text style={styles.footer}>
          Verification reference: {props.certificateNumber}. Public details remain anonymized unless explicit consent exists.
        </Text>
      </Page>
    </Document>
  );
}
