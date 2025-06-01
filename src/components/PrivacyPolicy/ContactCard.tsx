
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ContactCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg text-blue-600">Contact</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm">
          Heeft u vragen over dit privacybeleid of over hoe wij omgaan met uw persoonsgegevens? 
          Neem dan contact met ons op:
        </p>
        <div className="space-y-2 text-sm">
          <p>
            <strong>E-mail:</strong> info@ouderen-alarmering.nl
          </p>
          <p>
            <strong>Telefoon:</strong> +31 (0) 648216083
          </p>
          <p>
            <strong>Adres:</strong><br />
            Ouderen Alarm<br />
            Achterweg 28<br />
            4156AC, Rumpt<br />
            Nederland
          </p>
          <p>
            <strong>KvK-nummer:</strong> 94640319
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactCard;
