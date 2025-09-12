export default function Herroepingsrecht() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Herroepingsrecht</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Uw recht om af te zien van een online aankoop
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Wat is herroepingsrecht?</h2>
          <p>
            Het herroepingsrecht geeft u als consument het recht om binnen een bepaalde termijn 
            zonder opgave van redenen af te zien van een online aankoop. Voor Stylo geldt een 
            herroepingstermijn van 30 dagen.
          </p>

          <div className="bg-green-50 border border-green-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-semibold text-green-900 mb-3">30 dagen herroepingsrecht</h3>
            <p className="text-green-800">
              U heeft 30 dagen de tijd om uw bestelling te retourneren, gerekend vanaf de dag 
              waarop u (of een door u aangewezen derde) het product heeft ontvangen.
            </p>
          </div>

          <h2>Hoe maakt u gebruik van uw herroepingsrecht?</h2>
          <ol>
            <li>
              <strong>Melding:</strong> Meld uw beslissing om de overeenkomst te herroepen aan ons 
              via een ondubbelzinnige verklaring (bijvoorbeeld per e-mail naar info@stylo.nl).
            </li>
            <li>
              <strong>Retourzending:</strong> Zend het product uiterlijk 14 dagen na uw melding 
              aan ons retour. U kunt hiervoor ons gratis retourlabel gebruiken.
            </li>
            <li>
              <strong>Staat product:</strong> Zorg ervoor dat het product in originele staat is, 
              inclusief alle accessoires en verpakking.
            </li>
          </ol>

          <h2>Kosten</h2>
          <p>
            De kosten voor het retourneren van het product zijn voor onze rekening. U ontvangt 
            een gratis retourlabel van ons. Er worden geen administratiekosten in rekening gebracht.
          </p>

          <h2>Terugbetaling</h2>
          <p>
            Wij betalen alle door u betaalde bedragen, inclusief eventuele verzendkosten, 
            uiterlijk 14 dagen terug nadat wij uw herroeping hebben ontvangen. De terugbetaling 
            vindt plaats via dezelfde betaalmethode als waarmee u de oorspronkelijke transactie heeft verricht.
          </p>

          <h2>Uitzonderingen</h2>
          <p>Het herroepingsrecht geldt niet voor:</p>
          <ul>
            <li>Producten die op maat zijn gemaakt of duidelijk gepersonaliseerd zijn</li>
            <li>Producten die door hun aard niet kunnen worden teruggestuurd</li>
            <li>Producten die om hygiënische redenen niet geschikt zijn voor terugzending na uitpakken</li>
          </ul>

          <h2>Modelformulier herroeping</h2>
          <div className="bg-gray-50 rounded-xl p-6 my-8">
            <p className="font-semibold mb-4">Aan: Stylo, info@stylo.nl</p>
            <p>Hierbij deel ik/delen wij* u mede dat ik/wij* onze overeenkomst betreffende de verkoop van de volgende goederen* herroep(en)*:</p>
            <br />
            <p>Besteld op*: _______________</p>
            <p>Ontvangen op*: _______________</p>
            <p>Naam consument(en): _______________</p>
            <p>Adres consument(en): _______________</p>
            <p>Handtekening consument(en): _______________</p>
            <p>Datum: _______________</p>
            <br />
            <p className="text-sm text-gray-600">* Doorhalen wat niet van toepassing is</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 my-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Vragen?</h3>
            <p className="text-blue-800">
              Heeft u vragen over uw herroepingsrecht of het retourproces? 
              Neem gerust contact met ons op via info@stylo.nl of +31 620 176 727.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

