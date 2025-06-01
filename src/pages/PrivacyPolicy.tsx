
import { useState } from 'react';
import PrivacyHeader from '../components/PrivacyPolicy/PrivacyHeader';
import CompanyInfoCard from '../components/PrivacyPolicy/CompanyInfoCard';
import IntroductionCard from '../components/PrivacyPolicy/IntroductionCard';
import PrivacyArticle from '../components/PrivacyPolicy/PrivacyArticle';
import ContactCard from '../components/PrivacyPolicy/ContactCard';
import FooterInfo from '../components/PrivacyPolicy/FooterInfo';

const PrivacyPolicy = () => {
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
          <PrivacyHeader />
          
          <CompanyInfoCard />
          
          <IntroductionCard />

          <PrivacyArticle
            title="Artikel 1: Algemene bepalingen"
            isOpen={openSections.artikel1}
            onToggle={() => toggleSection('artikel1')}
          >
            <p>
              <strong>1.1</strong> In deze privacyverklaring leggen wij uit hoe we informatie verzamelen, 
              gebruiken, delen en beschermen met betrekking tot onze mobiele applicatie en websites 
              (gezamenlijk de "Service").
            </p>
            <p>
              <strong>1.2</strong> Door gebruik te maken van onze Service gaat u akkoord met de verzameling 
              en het gebruik van informatie in overeenstemming met dit beleid.
            </p>
            <p>
              <strong>1.3</strong> Wij verzamelen en gebruiken geen persoonlijke informatie over u, 
              tenzij u deze vrijwillig aan ons verstrekt.
            </p>
          </PrivacyArticle>

          <PrivacyArticle
            title="Artikel 2: Welke gegevens verwerkt Ouderen Alarm en waarvoor worden ze gebruikt?"
            isOpen={openSections.artikel2}
            onToggle={() => toggleSection('artikel2')}
          >
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2.1 GPS-locatie delen</h4>
              <p className="mb-2">
                Je actuele GPS-locatie is bepalend voor de services die Ouderen Alarm biedt 
                en wordt continue automatisch op de achtergrond geactualiseerd.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2.2 Waarom zou u uw GPS-locatie delen?</h4>
              <p className="mb-2">
                Het delen van uw GPS-locatie stelt ons in staat om u de best mogelijke service te bieden. 
                Uw locatie wordt gebruikt voor:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Het tonen van uw actuele positie aan uw hulpverleners</li>
                <li>Het berekenen van reistijden naar uw locatie</li>
                <li>Het versturen van alarmmeldingen met uw exacte positie</li>
                <li>Het tonen van nabijgelegen hulpverleners</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2.3 Alarm situatie</h4>
              <p className="mb-2">
                Het delen van de GPS-locatie is cruciaal voor effectieve alarmopvolging en snelle hulp. 
                Hulpverleners kunnen altijd de GPS-locatie van de alarmgever zien en wie het dichtst bij is.
              </p>
              <p className="mb-2">
                Wanneer u een alarm activeert, wordt automatisch een audio-opname gestart die wordt 
                gedeeld met uw hulpverleners. Deze opname helpt hen om de situatie beter in te schatten 
                en passende hulp te bieden.
              </p>
              <p>
                Alle alarmgegevens, inclusief locatie, tijd en audio-opnamen, worden bewaard voor 
                evaluatie en verbetering van onze dienstverlening.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2.4 Permanent locatie delen met familie, vrienden en team collega's</h4>
              <p className="mb-2">
                U kunt ervoor kiezen om uw locatie permanent te delen met vertrouwde personen. 
                Dit geeft hen inzicht in uw dagelijkse bewegingen en zorgt voor extra veiligheid.
              </p>
              <p>
                Deze functie kan op elk moment worden in- of uitgeschakeld via de app-instellingen.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2.5 Waarom wil je jouw online-status delen?</h4>
              <p className="mb-2">
                Door uw online-status te delen, kunnen uw hulpverleners zien wanneer u voor het laatst 
                actief was in de app. Dit helpt hen om uw situatie beter in te schatten.
              </p>
              <p>
                Uw online-status wordt alleen gedeeld met personen die u heeft toegevoegd als hulpverlener.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2.6 Waarom zou u extra persoonlijke informatie toevoegen?</h4>
              <p className="mb-2">
                Extra persoonlijke informatie zoals medische gegevens, allergieën of medicijngebruik 
                kan levensreddend zijn in noodsituaties. Deze informatie wordt alleen gedeeld met 
                uw hulpverleners en professionele hulpdiensten.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">2.7 Overzicht van gegevens</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div>
                  <h5 className="font-semibold text-gray-800">Gebruiker details:</h5>
                  <p>Voor- en achternaam, e-mail, mobiel telefoonnummer, geboortedatum, adres, medische informatie, contactgegevens hulpverleners</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">App data:</h5>
                  <p>GPS-locatie, online-status, audio opname tijdens alarm, gemarkeerde geo-locaties, alarm geschiedenis</p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800">Technische gegevens:</h5>
                  <p>IP-adres, browser type, apparaat informatie, app versie, crash logs</p>
                </div>
              </div>
            </div>
          </PrivacyArticle>

          <PrivacyArticle
            title="Artikel 3: Duur van opslag"
            isOpen={openSections.artikel3}
            onToggle={() => toggleSection('artikel3')}
          >
            <p>
              <strong>3.1</strong> Bedrijf- en gebruikergegevens blijven verzameld en opgeslagen zolang de Service wordt gebruikt.
            </p>
            <p>
              <strong>3.2</strong> Wanneer een abonnement afloopt, worden de gegevens voor maximaal een jaar bewaard in een archief.
            </p>
            <p>
              <strong>3.3</strong> App data zoals GPS-locaties en alarm geschiedenis worden voor maximaal 3 maanden bewaard.
            </p>
            <p>
              <strong>3.4</strong> Audio-opnamen van alarmen worden maximaal 6 maanden bewaard, tenzij deze nodig zijn voor juridische procedures.
            </p>
            <p>
              <strong>3.5</strong> U kunt op elk moment verzoeken om verwijdering van uw gegevens, behoudens wettelijke bewaarplichten.
            </p>
          </PrivacyArticle>

          <PrivacyArticle
            title="Artikel 4: Uw rechten onder de AVG"
            isOpen={openSections.artikel4}
            onToggle={() => toggleSection('artikel4')}
          >
            <div>
              <h4 className="font-semibold text-gray-900">4.1 Recht van inzage (artikel 15 AVG)</h4>
              <p>U kunt uw gegevens altijd online inzien via Ouderen Alarm. U heeft het recht om een overzicht te ontvangen van alle persoonsgegevens die wij van u verwerken.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">4.2 Recht op rectificatie (artikel 16 AVG)</h4>
              <p>U kunt uw gegevens online wijzigen via Ouderen Alarm. Heeft u vragen of lukt het niet, neem dan contact met ons op.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">4.3 Recht op gegevenswissing (artikel 17 AVG)</h4>
              <p>U heeft het recht van vergetelheid - wij kunnen uw gegevens verwijderen. Dit recht geldt onder bepaalde omstandigheden, zoals wanneer de gegevens niet langer nodig zijn voor het doel waarvoor ze zijn verzameld.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">4.4 Recht op beperking van de verwerking (artikel 18 AVG)</h4>
              <p>U kunt vragen om beperking van de verwerking van uw persoonsgegevens in bepaalde gevallen, bijvoorbeeld als u de juistheid van de gegevens betwist.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">4.5 Recht op overdraagbaarheid van gegevens (artikel 20 AVG)</h4>
              <p>U kunt altijd alle gegevens opvragen die wij van u hebben verzameld. Deze gegevens leveren wij in een gestructeerde, gangbare en machineleesbare vorm.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">4.6 Recht van bezwaar (artikel 21 AVG)</h4>
              <p>U heeft het recht om bezwaar te maken tegen de verwerking van uw persoonsgegevens, bijvoorbeeld voor directmarketing.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">4.7 Klacht indienen</h4>
              <p>Bent u ontevreden over hoe wij met uw persoonsgegevens omgaan? Dan kunt u contact met ons opnemen. U heeft ook het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens.</p>
            </div>
          </PrivacyArticle>

          <PrivacyArticle
            title="Artikel 5: Veiligheid & Derden"
            isOpen={openSections.artikel5}
            onToggle={() => toggleSection('artikel5')}
          >
            <div>
              <h4 className="font-semibold text-gray-900">5.1 Veiligheid</h4>
              <p className="mb-2">
                We gebruiken redelijke administratieve, logische, fysieke en beheersmaatregelen 
                om uw persoonlijke gegevens te beveiligen tegen verlies, diefstal en ongeoorloofde toegang.
              </p>
              <p className="mb-2">
                Onze beveiligingsmaatregelen omvatten onder andere:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Encryptie van gegevens tijdens verzending en opslag</li>
                <li>Regelmatige beveiligingsaudits en updates</li>
                <li>Toegangscontroles en authenticatie</li>
                <li>Monitoring van ongeautoriseerde toegang</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">5.2 Derden</h4>
              <p className="mb-2">
                Wij delen alle gegevens nooit met derden, tenzij u hier toestemming voor heeft gegeven 
                of als het gaat om een wettelijke verplichting.
              </p>
              <p className="mb-2">
                Wij kunnen gebruik maken van derde partijen voor:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Het hosten van onze servers (onder strikte beveiligingsafspraken)</li>
                <li>Het versturen van notificaties</li>
                <li>Analytics en verbetering van onze service</li>
                <li>Wettelijk verplichte rapportages</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">5.3 Internationale overdrachten</h4>
              <p>
                Als wij persoonsgegevens overdragen naar landen buiten de EU/EER, zorgen wij ervoor 
                dat hiervoor passende waarborgen gelden conform de AVG.
              </p>
            </div>
          </PrivacyArticle>

          <PrivacyArticle
            title="Artikel 6: Rechtsgrond voor verwerking"
            isOpen={openSections.artikel6}
            onToggle={() => toggleSection('artikel6')}
          >
            <p>
              <strong>6.1</strong> Wij verwerken uw persoonsgegevens op basis van de volgende rechtsgronden:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Toestemming:</strong> Voor het delen van uw locatie en andere vrijwillige gegevens</li>
              <li><strong>Uitvoering overeenkomst:</strong> Voor het leveren van onze alarmservice</li>
              <li><strong>Vitale belangen:</strong> Voor het beschermen van uw leven of gezondheid in noodsituaties</li>
              <li><strong>Wettelijke verplichting:</strong> Voor het naleven van wettelijke bewaarplichten</li>
              <li><strong>Gerechtvaardigd belang:</strong> Voor verbetering van onze service en veiligheid</li>
            </ul>
          </PrivacyArticle>

          <PrivacyArticle
            title="Artikel 7: Functionaris voor gegevensbescherming"
            isOpen={openSections.artikel7}
            onToggle={() => toggleSection('artikel7')}
          >
            <p>
              <strong>7.1</strong> Ouderen Alarm heeft een functionaris voor gegevensbescherming aangesteld 
              die toeziet op de naleving van de privacywetgeving.
            </p>
            <p>
              <strong>7.2</strong> U kunt de functionaris voor gegevensbescherming bereiken via:
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p><strong>E-mail:</strong> privacy@ouderen-alarmering.nl</p>
              <p><strong>Post:</strong> Ouderen Alarm, t.a.v. FG, Achterweg 28, 4156AC Rumpt</p>
            </div>
          </PrivacyArticle>

          <PrivacyArticle
            title="Artikel 8: Wijzigingen in privacyverklaring"
            isOpen={openSections.artikel8}
            onToggle={() => toggleSection('artikel8')}
          >
            <p>
              <strong>8.1</strong> Wij kunnen deze privacyverklaring van tijd tot tijd bijwerken. 
              Wijzigingen worden bekendgemaakt via onze app en website.
            </p>
            <p>
              <strong>8.2</strong> Bij belangrijke wijzigingen die uw rechten beïnvloeden, zullen wij 
              u hiervan op de hoogte stellen via e-mail of een melding in de app.
            </p>
            <p>
              <strong>8.3</strong> Door het blijven gebruiken van onze service na wijzigingen, 
              gaat u akkoord met de bijgewerkte privacyverklaring.
            </p>
          </PrivacyArticle>

          <PrivacyArticle
            title="Website bezoek en cookies"
            isOpen={openSections.cookies}
            onToggle={() => toggleSection('cookies')}
          >
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.1 Functionele cookies</h4>
              <p className="mb-2">
                Functionele cookies zijn noodzakelijk voor het goed functioneren van onze website 
                en app. Deze cookies zorgen ervoor dat u kunt inloggen, uw voorkeuren worden onthouden 
                en de website correct wordt weergegeven.
              </p>
              <p>
                Voorbeelden van functionele cookies:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                <li>Inloggegevens en sessiemanagement</li>
                <li>Taalinstellingen</li>
                <li>Beveiligingscookies</li>
                <li>Winkelwagen en formuliergegevens</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.2 Analyse- en marketingcookies</h4>
              <p className="mb-2">
                Deze cookies helpen ons te begrijpen hoe bezoekers onze website gebruiken, 
                zodat we de gebruikerservaring kunnen verbeteren. Voor het plaatsen van 
                deze cookies vragen wij uw toestemming.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.3 Google Analytics</h4>
              <p className="mb-2">
                Wij gebruiken Google Analytics om websitestatistieken bij te houden. 
                Google Analytics plaatst cookies om informatie te verzamelen over uw gebruik 
                van onze website.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Gegevens die worden verzameld:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                  <li>Paginabezoeken en gebruiksduur</li>
                  <li>Geografische locatie (land/stad niveau)</li>
                  <li>Apparaat- en browserinformatie</li>
                  <li>Verkeersbronnen</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.4 Taboola</h4>
              <p>
                Taboola wordt gebruikt voor het tonen van aanbevolen content en advertenties. 
                Deze service plaatst cookies om uw interesses te bepalen en relevante content te tonen.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.5 Outbrain</h4>
              <p>
                Outbrain helpt ons bij het promoten van onze content op andere websites. 
                Deze service gebruikt cookies om de effectiviteit van onze promotiecampagnes te meten.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.6 Facebook</h4>
              <p className="mb-2">
                Wij gebruiken Facebook-services voor social media integratie en advertenties. 
                Facebook plaatst cookies om uw activiteiten te volgen en relevante advertenties te tonen.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Facebook-services die we gebruiken:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                  <li>Facebook Pixel voor conversietracking</li>
                  <li>Facebook Login integratie</li>
                  <li>Facebook Custom Audiences</li>
                  <li>Social media plugins</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.7 Hotjar</h4>
              <p className="mb-2">
                Hotjar helpt ons de gebruikerservaring te verbeteren door het gedrag van 
                bezoekers op onze website te analyseren door middel van heatmaps en sessie-opnamen.
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Hotjar verzamelt:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4 mt-1">
                  <li>Muisbewegingen en klikgedrag</li>
                  <li>Scroll- en navigatiepatronen</li>
                  <li>Formulierinteracties (geen persoonlijke gegevens)</li>
                  <li>Schermresolutie en apparaattype</li>
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">8.8 Cookies beheren</h4>
              <p className="mb-2">
                U kunt uw cookie-instellingen aanpassen via de cookie-banner op onze website 
                of via uw browserinstellingen. Let op: het uitschakelen van functionele cookies 
                kan de werking van onze website beïnvloeden.
              </p>
              <p>
                Voor meer informatie over het beheren van cookies in uw browser, bezoek: 
                <strong> www.allaboutcookies.org</strong>
              </p>
            </div>
          </PrivacyArticle>

          <ContactCard />

          <FooterInfo />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
