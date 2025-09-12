export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacybeleid</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Hoe wij omgaan met jouw persoonlijke gegevens
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <h2>Inleiding</h2>
          <p>
            Stylo hecht veel waarde aan de bescherming van uw persoonlijke gegevens. In dit privacybeleid 
            leggen wij uit welke persoonlijke gegevens wij verzamelen en hoe wij deze gebruiken.
          </p>

          <h2>Welke gegevens verzamelen wij?</h2>
          <ul>
            <li>Contactgegevens (naam, e-mailadres, telefoonnummer)</li>
            <li>Adresgegevens voor verzending</li>
            <li>Bestellingsgeschiedenis</li>
            <li>Website gebruiksgegevens (cookies)</li>
          </ul>

          <h2>Hoe gebruiken wij uw gegevens?</h2>
          <ul>
            <li>Voor het verwerken van uw bestellingen</li>
            <li>Voor klantenservice en ondersteuning</li>
            <li>Voor het versturen van orderbevestigingen</li>
            <li>Voor het verbeteren van onze website en diensten</li>
          </ul>

          <h2>Delen van gegevens</h2>
          <p>
            Wij delen uw persoonlijke gegevens niet met derden, behalve wanneer dit noodzakelijk is 
            voor het uitvoeren van uw bestelling (bijvoorbeeld met bezorgdiensten).
          </p>

          <h2>Uw rechten</h2>
          <ul>
            <li>Recht op inzage van uw gegevens</li>
            <li>Recht op rectificatie van onjuiste gegevens</li>
            <li>Recht op verwijdering van uw gegevens</li>
            <li>Recht op beperking van verwerking</li>
          </ul>

          <h2>Contact</h2>
          <p>
            Voor vragen over dit privacybeleid kunt u contact met ons opnemen via 
            <a href="mailto:info@stylo.nl" className="text-blue-600 hover:text-blue-800">info@stylo.nl</a> 
            of telefonisch via +31 620 176 727.
          </p>

          <p className="text-sm text-gray-500 mt-8">
            Laatst bijgewerkt: Januari 2025
          </p>
        </div>
      </div>
    </div>
  );
}

