
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../components/ui/collapsible';
import { useState } from 'react';

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="h-full bg-blue-50 overflow-y-auto">
      <div className="safe-area-pt">
        <div className="p-4 space-y-6 pb-20">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate('/settings')}
              className="shrink-0"
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Privacy Beleid</h2>
              <p className="text-sm text-gray-600">Ouderen Alarmering</p>
            </div>
          </div>

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

          <Card>
            <CardContent className="p-4">
              <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mb-4">
                <p className="text-sm">
                  <strong>Belangrijke informatie:</strong> In ons privacybeleid leggen we uit hoe we informatie verzamelen, 
                  gebruiken, delen en beschermen met betrekking tot het op de meest effectieve manier leveren van onze 
                  diensten en producten.
                </p>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                Dit is het privacy beleid van Ouderen Alarm, een bedrijf gevestigd in Nederland. 
                Wij verwerken persoonsgegevens op een manier die in overeenstemming is met de 
                Algemene Verordening Gegevensbescherming (AVG).
              </p>
            </CardContent>
          </Card>

          <Collapsible open={openSections.gegevens} onOpenChange={() => toggleSection('gegevens')}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <CardTitle className="text-lg text-blue-600 flex items-center justify-between">
                    Welke gegevens verwerkt Ouderen Alarm?
                    <span className="text-sm">{openSections.gegevens ? '−' : '+'}</span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">GPS-locatie delen</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Je actuele GPS-locatie is bepalend voor de services die Ouderen Alarm biedt 
                      en wordt continue automatisch op de achtergrond geactualiseerd.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Alarm situatie</h4>
                    <p className="text-sm text-gray-700 mb-2">
                      Het delen van de GPS-locatie is cruciaal voor effectieve alarmopvolging en snelle hulp. 
                      Hulpverleners kunnen altijd de GPS-locatie van de alarmgever zien en wie het dichtst bij is.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Overzicht van gegevens</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Gebruiker details:</strong> Voor- en achternaam, e-mail, mobiel telefoonnummer, medische informatie, contactgegevens hulpverleners</p>
                      <p><strong>App data:</strong> GPS-locatie, online-status, audio opname tijdens alarm, gemarkeerde geo-locaties</p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.opslag} onOpenChange={() => toggleSection('opslag')}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <CardTitle className="text-lg text-blue-600 flex items-center justify-between">
                    Duur van opslag
                    <span className="text-sm">{openSections.opslag ? '−' : '+'}</span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent>
                  <p className="text-sm text-gray-700">
                    Bedrijf- en gebruikergegevens blijven verzameld en opgeslagen zolang de Service wordt gebruikt. 
                    Wanneer een abonnement afloopt, worden de gegevens voor maximaal een jaar bewaard in een archief. 
                    App data worden voor maximaal 3 maanden bewaard.
                  </p>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.rechten} onOpenChange={() => toggleSection('rechten')}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <CardTitle className="text-lg text-blue-600 flex items-center justify-between">
                    Uw rechten
                    <span className="text-sm">{openSections.rechten ? '−' : '+'}</span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Recht op overdraagbaarheid van gegevens</h4>
                    <p className="text-sm text-gray-700">U kunt altijd alle gegevens opvragen die wij van u hebben verzameld.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Recht op gegevenswissing</h4>
                    <p className="text-sm text-gray-700">U heeft het recht van vergetelheid - wij kunnen uw gegevens verwijderen.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Recht van inzage</h4>
                    <p className="text-sm text-gray-700">U kunt uw gegevens altijd online inzien via Ouderen Alarm.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Recht op rectificatie</h4>
                    <p className="text-sm text-gray-700">U kunt uw gegevens online wijzigen via Ouderen Alarm.</p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={openSections.veiligheid} onOpenChange={() => toggleSection('veiligheid')}>
            <Card>
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-50">
                  <CardTitle className="text-lg text-blue-600 flex items-center justify-between">
                    Veiligheid & Derden
                    <span className="text-sm">{openSections.veiligheid ? '−' : '+'}</span>
                  </CardTitle>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">Veiligheid</h4>
                    <p className="text-sm text-gray-700">
                      We gebruiken redelijke administratieve, logische, fysieke en beheersmaatregelen 
                      om uw persoonlijke gegevens te beveiligen tegen verlies, diefstal en ongeoorloofde toegang.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Derden</h4>
                    <p className="text-sm text-gray-700">
                      Wij delen alle gegevens nooit met derden, tenzij u hier toestemming voor heeft gegeven 
                      of als het gaat om een wettelijke verplichting.
                    </p>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg text-blue-600">Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">
                <strong>E-mail:</strong> info@ouderen-alarmering.nl
              </p>
              <p className="text-sm">
                <strong>Telefoon:</strong> +31 (0) 648216083
              </p>
              <p className="text-sm">
                <strong>Adres:</strong><br />
                Ouderen Alarm<br />
                Achterweg 28<br />
                4156AC, Rumpt
              </p>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-gray-500 pt-4">
            Dit privacybeleid voldoet aan de AVG (Algemene Verordening Gegevensbescherming) en Nederlandse wetgeving.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
