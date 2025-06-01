
import { Card, CardContent } from '../ui/card';

const IntroductionCard = () => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
          <p className="text-sm">
            <strong>Belangrijke informatie:</strong> In ons privacybeleid leggen we uit hoe we informatie verzamelen, 
            gebruiken, delen en beschermen met betrekking tot het op de meest effectieve manier leveren van onze 
            diensten en producten.
          </p>
        </div>
        <div className="space-y-4 text-sm text-gray-700">
          <p>
            Dit is het privacy beleid van Ouderen Alarm, een bedrijf gevestigd in Nederland. 
            Wij verwerken persoonsgegevens op een manier die in overeenstemming is met de 
            Algemene Verordening Gegevensbescherming (AVG).
          </p>
          <p>
            We vinden het belangrijk dat u weet welke persoonsgegevens door ons worden verzameld, 
            hoe we deze gebruiken en welke keuzes u heeft. Dit privacybeleid geeft u duidelijke 
            informatie over onze gegevensverwerking.
          </p>
          <p>
            Wanneer we het in dit privacybeleid hebben over 'Ouderen Alarm', 'wij', 'ons' of 'onze', 
            bedoelen we Ouderen Alarm. Wanneer we het hebben over de 'dienst' of 'service', 
            bedoelen we de diensten die Ouderen Alarm aanbiedt.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntroductionCard;
