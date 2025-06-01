
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const CompanyInfoCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-blue-600">Bedrijfsinformatie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p><strong>Ouderen Alarm</strong></p>
        <p>Achterweg 28, 4156AC Rumpt</p>
        <p>KvK: 94640319</p>
        <p><strong>Laatste update:</strong> 26-05-2025</p>
      </CardContent>
    </Card>
  );
};

export default CompanyInfoCard;
