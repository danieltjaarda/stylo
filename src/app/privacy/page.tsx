import { Shield, User, MapPin, Package, Globe, Lock, Eye, Edit, Trash2, Pause, Download, X, Mail, Phone, MapPinIcon } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacybeleid | DESKNA',
  description: 'Lees ons privacybeleid en ontdek hoe DESKNA omgaat met jouw persoonlijke gegevens. Transparantie en privacy staan bij ons voorop.',
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacybeleid</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Hoe wij omgaan met jouw persoonlijke gegevens
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 lg:p-12">
          <div className="prose prose-lg max-w-none">
            
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">1. Inleiding</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  DESKNA hecht veel waarde aan de bescherming van uw persoonlijke gegevens en de privacy van onze bezoekers. 
                  Wij gaan zorgvuldig om met persoonlijke gegevens en houden ons aan de geldende wet- en regelgeving, 
                  waaronder de Algemene Verordening Gegevensbescherming (AVG).
                </p>
                <p>
                  In dit privacybeleid leggen wij uit welke persoonlijke gegevens wij verzamelen, waarom wij deze verzamelen, 
                  hoe wij deze gebruiken en welke rechten u heeft met betrekking tot uw persoonlijke gegevens.
                </p>
                <p>
                  Dit privacybeleid is van toepassing op alle diensten die worden aangeboden door DESKNA via onze website, 
                  webshop en andere kanalen.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">2. Welke gegevens verzamelen wij?</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Wij verzamelen alleen die persoonlijke gegevens die noodzakelijk zijn voor het uitvoeren van onze diensten. 
                  Dit kunnen de volgende gegevens zijn:
                </p>
                
                <div className="border border-gray-200 rounded-lg p-6 my-6">
                  <div className="flex items-center mb-4">
                    <User className="w-5 h-5 text-gray-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Contactgegevens:</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 ml-8">
                    <li>• Voor- en achternaam</li>
                    <li>• E-mailadres</li>
                    <li>• Telefoonnummer</li>
                    <li>• Bedrijfsnaam (indien van toepassing)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 my-6">
                  <div className="flex items-center mb-4">
                    <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Adresgegevens:</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 ml-8">
                    <li>• Straatnaam en huisnummer</li>
                    <li>• Postcode en woonplaats</li>
                    <li>• Land</li>
                    <li>• Afwijkend bezorgadres (indien van toepassing)</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 my-6">
                  <div className="flex items-center mb-4">
                    <Package className="w-5 h-5 text-gray-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Bestellingsgegevens:</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 ml-8">
                    <li>• Bestellingsgeschiedenis</li>
                    <li>• Productvoorkeuren</li>
                    <li>• Betaalgegevens (via beveiligde externe diensten)</li>
                    <li>• Communicatie over uw bestelling</li>
                  </ul>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 my-6">
                  <div className="flex items-center mb-4">
                    <Globe className="w-5 h-5 text-gray-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Website gebruiksgegevens:</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 ml-8">
                    <li>• IP-adres</li>
                    <li>• Browsertype en -versie</li>
                    <li>• Bezochte pagina's en klikgedrag</li>
                    <li>• Cookies en vergelijkbare technologieën</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">3. Hoe gebruiken wij uw gegevens?</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Wij gebruiken uw persoonlijke gegevens uitsluitend voor de doeleinden waarvoor zij zijn verzameld. 
                  Dit kan zijn voor:
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Package className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Bestellingen verwerken</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Het verwerken van uw bestellingen, betalingen en verzending van producten naar het door u opgegeven adres.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Shield className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Klantenservice</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Het bieden van klantenservice, ondersteuning bij vragen en het afhandelen van klachten of retourzendingen.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Mail className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Communicatie</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Het versturen van orderbevestigingen, verzendmeldingen en andere transactionele e-mails.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Globe className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Website verbetering</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      Het analyseren van websitegebruik om onze diensten en gebruikerservaring te verbeteren.
                    </p>
                  </div>
                </div>

                <p>
                  Wij gebruiken uw gegevens <strong>niet</strong> voor het versturen van ongevraagde marketing-e-mails, 
                  tenzij u hier expliciet toestemming voor heeft gegeven.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">4. Delen van gegevens met derden</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Uw privacy is belangrijk voor ons. Wij verkopen, verhuren of delen uw persoonlijke gegevens niet met derden 
                  voor commerciële doeleinden.
                </p>
                <p>
                  Wij delen uw gegevens alleen wanneer dit noodzakelijk is voor het uitvoeren van uw bestelling of wanneer 
                  wij hiertoe wettelijk verplicht zijn:
                </p>
                
                <div className="border border-gray-300 rounded-lg p-6 my-6">
                  <div className="flex items-center mb-3">
                    <Shield className="w-5 h-5 text-gray-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Beperkte gegevensdeling:</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 ml-8">
                    <li>• <strong>Bezorgdiensten:</strong> Voor het bezorgen van uw bestelling</li>
                    <li>• <strong>Betaaldiensten:</strong> Voor het verwerken van betalingen (Mollie, Stripe)</li>
                    <li>• <strong>Hosting:</strong> Voor het beschikbaar houden van onze website</li>
                    <li>• <strong>Wettelijke verplichting:</strong> Wanneer dit door de wet wordt vereist</li>
                  </ul>
                </div>

                <p>
                  Alle externe dienstverleners die toegang hebben tot uw gegevens zijn contractueel verplicht om deze 
                  gegevens veilig te behandelen en uitsluitend te gebruiken voor het doel waarvoor zij zijn verstrekt.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">5. Uw rechten</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Onder de AVG heeft u verschillende rechten met betrekking tot uw persoonlijke gegevens. 
                  Deze rechten kunt u te allen tijde uitoefenen door contact met ons op te nemen:
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8">
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Eye className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Recht op inzage</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      U heeft het recht om te weten welke persoonlijke gegevens wij van u verwerken.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Edit className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Recht op rectificatie</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      U kunt onjuiste of onvolledige gegevens laten corrigeren of aanvullen.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Trash2 className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Recht op verwijdering</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      U kunt verzoeken om verwijdering van uw persoonlijke gegevens ('recht om vergeten te worden').
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Pause className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Recht op beperking</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      U kunt de verwerking van uw gegevens laten beperken onder bepaalde omstandigheden.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <Download className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Recht op overdraagbaarheid</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      U kunt uw gegevens in een gestructureerd formaat opvragen en overdragen.
                    </p>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-3">
                      <X className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Recht van bezwaar</h3>
                    </div>
                    <p className="text-gray-700 text-sm">
                      U kunt bezwaar maken tegen de verwerking van uw gegevens voor bepaalde doeleinden.
                    </p>
                  </div>
                </div>

                <p>
                  Wij behandelen uw verzoek binnen 30 dagen. In sommige gevallen kunnen wij uw verzoek niet volledig 
                  inwilligen, bijvoorbeeld wanneer wij wettelijk verplicht zijn bepaalde gegevens te bewaren.
                </p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">6. Beveiliging van uw gegevens</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Wij nemen de beveiliging van uw persoonlijke gegevens zeer serieus en hebben passende technische 
                  en organisatorische maatregelen getroffen om uw gegevens te beschermen tegen verlies, misbruik, 
                  ongeautoriseerde toegang en openbaarmaking.
                </p>
                
                <div className="border border-gray-200 rounded-lg p-6 my-6">
                  <div className="flex items-center mb-4">
                    <Lock className="w-5 h-5 text-gray-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Onze beveiligingsmaatregelen:</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 ml-8">
                    <li>• SSL-versleuteling voor alle datatransmissie</li>
                    <li>• Regelmatige beveiligingsupdates en monitoring</li>
                    <li>• Beperkte toegang tot persoonlijke gegevens</li>
                    <li>• Veilige opslag in geautoriseerde datacenters</li>
                    <li>• Regelmatige back-ups en herstelplannen</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">7. Bewaartermijnen</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Wij bewaren uw persoonlijke gegevens niet langer dan noodzakelijk voor de doeleinden waarvoor zij 
                  zijn verzameld of zoals vereist door de wet.
                </p>
                
                <div className="border border-gray-200 rounded-lg p-6 my-6">
                  <div className="flex items-center mb-4">
                    <Package className="w-5 h-5 text-gray-600 mr-3" />
                    <h3 className="font-semibold text-gray-900">Bewaartermijnen per categorie:</h3>
                  </div>
                  <ul className="space-y-2 text-gray-700 ml-8">
                    <li>• <strong>Bestellingsgegevens:</strong> 7 jaar (fiscale wetgeving)</li>
                    <li>• <strong>Klantaccounts:</strong> Tot u uw account verwijdert</li>
                    <li>• <strong>Marketing toestemmingen:</strong> Tot u zich afmeldt</li>
                    <li>• <strong>Website analytics:</strong> Maximaal 2 jaar</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-3">8. Contact en klachten</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Heeft u vragen over dit privacybeleid of wilt u gebruik maken van uw rechten? 
                  Neem dan contact met ons op:
                </p>
                
                <div className="border border-gray-200 rounded-lg p-8 my-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center mb-3">
                        <Mail className="w-5 h-5 text-gray-600 mr-3" />
                        <h3 className="font-semibold text-gray-900">E-mail</h3>
                      </div>
                      <p className="ml-8">
                        <a href="mailto:privacy@deskna.nl" className="text-gray-900 hover:text-gray-700 font-medium">
                          privacy@deskna.nl
                        </a>
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center mb-3">
                        <Phone className="w-5 h-5 text-gray-600 mr-3" />
                        <h3 className="font-semibold text-gray-900">Telefoon</h3>
                      </div>
                      <p className="ml-8">
                        <a href="tel:+31850602482" className="text-gray-900 hover:text-gray-700 font-medium">
                          085 060 2482
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-300">
                    <div className="flex items-center mb-3">
                      <MapPinIcon className="w-5 h-5 text-gray-600 mr-3" />
                      <h3 className="font-semibold text-gray-900">Postadres</h3>
                    </div>
                    <p className="text-gray-700 ml-8">
                      DESKNA<br />
                      T.a.v. Privacy Officer<br />
                      [Adres]<br />
                      [Postcode] [Plaats]
                    </p>
                  </div>
                </div>

                <p>
                  Bent u niet tevreden over de manier waarop wij omgaan met uw persoonlijke gegevens? 
                  Dan kunt u ook een klacht indienen bij de Autoriteit Persoonsgegevens via 
                  <a href="https://autoriteitpersoonsgegevens.nl" className="text-gray-900 hover:text-gray-700 font-medium ml-1 underline">
                    autoriteitpersoonsgegevens.nl
                  </a>.
                </p>
              </div>
            </section>

            <section className="border-t border-gray-200 pt-8">
              <div className="border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Laatst bijgewerkt:</strong> Januari 2025
                </p>
                <p className="text-xs text-gray-500">
                  Wij kunnen dit privacybeleid van tijd tot tijd aanpassen. Wijzigingen worden op deze pagina gepubliceerd.
                </p>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}



