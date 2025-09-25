import { Metadata } from 'next';

// Voorkom indexering door zoekmachines
export const metadata: Metadata = {
  title: 'Google Feed Checker - DESKNA',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};

export default function FeedChecker() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
            body {
              font-family: Arial, sans-serif;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              margin-bottom: 20px;
            }
            h1 {
              color: #333;
              border-bottom: 3px solid #4CAF50;
              padding-bottom: 10px;
            }
            .status {
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
            .error { background: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
            .info { background: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
            
            button {
              background: #4CAF50;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 5px;
              cursor: pointer;
              margin: 5px;
              font-size: 16px;
            }
            button:hover { background: #45a049; }
            button.secondary { background: #2196F3; }
            button.secondary:hover { background: #0b7dda; }
            
            .stats {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .stat-box {
              background: #f8f9fa;
              padding: 15px;
              border-radius: 5px;
              text-align: center;
              border-left: 4px solid #4CAF50;
            }
            .stat-number {
              font-size: 24px;
              font-weight: bold;
              color: #4CAF50;
            }
            .stat-label {
              color: #666;
              font-size: 14px;
            }
            
            .feed-preview {
              background: #f8f9fa;
              border: 1px solid #ddd;
              border-radius: 5px;
              padding: 15px;
              max-height: 400px;
              overflow-y: auto;
              font-family: monospace;
              font-size: 12px;
              white-space: pre-wrap;
            }
            
            .validation-checklist {
              background: white;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .check-item {
              padding: 10px;
              margin: 5px 0;
              border-radius: 5px;
              display: flex;
              align-items: center;
            }
            .check-item.pass {
              background: #d4edda;
              color: #155724;
            }
            .check-item.fail {
              background: #f8d7da;
              color: #721c24;
            }
            .check-icon {
              margin-right: 10px;
              font-weight: bold;
            }
            
            .external-links {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .link-card {
              background: white;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              text-decoration: none;
              color: inherit;
              border-left: 4px solid #2196F3;
              transition: transform 0.2s;
            }
            .link-card:hover {
              transform: translateY(-2px);
              text-decoration: none;
            }
            .link-title {
              font-weight: bold;
              color: #2196F3;
              margin-bottom: 5px;
            }
            .link-desc {
              font-size: 14px;
              color: #666;
            }
          `
        }} />
      
      <div>
        <div className="container">
          <h1>🛍️ Google Merchant Feed Checker</h1>
          <p>Controleer of je Google Merchant Center productfeed correct werkt.</p>
          
          <div>
            <button onClick={() => (window as any).checkFeed()}>🔍 Feed Controleren</button>
            <button onClick={() => (window as any).openFeedInNewTab()} className="secondary">📄 Feed Bekijken</button>
            <button onClick={() => (window as any).downloadFeed()} className="secondary">⬇️ Feed Downloaden</button>
          </div>
          
          <div id="status"></div>
          <div id="stats"></div>
        </div>

        <div className="container">
          <h2>📋 Validatie Checklist</h2>
          <div id="validation-results" className="validation-checklist">
            <div className="info">Klik op "Feed Controleren" om de validatie te starten...</div>
          </div>
        </div>

        <div className="container">
          <h2>🔗 Externe Validatie Tools</h2>
          <div className="external-links">
            <a href="https://www.google.com/merchants/" target="_blank" className="link-card">
              <div className="link-title">Google Merchant Center</div>
              <div className="link-desc">Upload je feed hier en controleer de status</div>
            </a>
            <a href="https://support.google.com/merchants/answer/7052112" target="_blank" className="link-card">
              <div className="link-title">Google Feed Specificaties</div>
              <div className="link-desc">Officiële documentatie voor productfeeds</div>
            </a>
            <a href="https://developers.google.com/shopping-content/guides/products/feed-format" target="_blank" className="link-card">
              <div className="link-title">Feed Format Guide</div>
              <div className="link-desc">Technische specificaties en voorbeelden</div>
            </a>
            <a href="https://www.feedvalidator.org/" target="_blank" className="link-card">
              <div className="link-title">Feed Validator</div>
              <div className="link-desc">Online XML feed validator tool</div>
            </a>
          </div>
        </div>

        <div className="container">
          <h2>📊 Feed Preview</h2>
          <div id="feed-preview" className="feed-preview">
            Klik op "Feed Controleren" om een preview te zien...
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
          __html: `
            let feedData = null;

            async function checkFeed() {
              const statusDiv = document.getElementById('status');
              const statsDiv = document.getElementById('stats');
              const validationDiv = document.getElementById('validation-results');
              const previewDiv = document.getElementById('feed-preview');
              
              statusDiv.innerHTML = '<div class="info">🔄 Feed aan het valideren...</div>';
              
              try {
                // Gebruik de nieuwe validatie API
                const validationResponse = await fetch('/api/validate-feed');
                
                if (!validationResponse.ok) {
                  throw new Error('HTTP ' + validationResponse.status + ': ' + validationResponse.statusText);
                }
                
                const validation = await validationResponse.json();
                
                // Haal ook de XML feed op voor preview
                const feedResponse = await fetch('/api/google-feed');
                const xmlText = await feedResponse.text();
                feedData = xmlText;
                
                // Display status
                if (validation.valid) {
                  statusDiv.innerHTML = '<div class="success">✅ Feed is geldig en geoptimaliseerd!</div>';
                } else {
                  statusDiv.innerHTML = '<div class="error">⚠️ Feed heeft problemen die aandacht nodig hebben</div>';
                }
                
                // Display enhanced stats
                const stats = validation.feedStats;
                statsDiv.innerHTML = 
                  '<div class="stats">' +
                    '<div class="stat-box"><div class="stat-number">' + stats.totalItems + '</div><div class="stat-label">Product Items</div></div>' +
                    '<div class="stat-box"><div class="stat-number">' + stats.feedSize + 'KB</div><div class="stat-label">Feed Grootte</div></div>' +
                    '<div class="stat-box"><div class="stat-number">€' + stats.priceRange.min + '-€' + stats.priceRange.max + '</div><div class="stat-label">Prijsbereik</div></div>' +
                    '<div class="stat-box"><div class="stat-number">' + stats.uniqueCategories.length + '</div><div class="stat-label">Categorieën</div></div>' +
                    '<div class="stat-box"><div class="stat-number">' + validation.summary.validItems + '/' + validation.summary.totalItems + '</div><div class="stat-label">Geldige Items</div></div>' +
                    '<div class="stat-box"><div class="stat-number">' + validation.summary.warnings + '</div><div class="stat-label">Waarschuwingen</div></div>' +
                  '</div>';
                
                // Display validation results
                displayValidationResults(validation, validationDiv);
                
                // Show preview
                previewDiv.textContent = xmlText.substring(0, 2000) + (xmlText.length > 2000 ? '...\\n\\n[Eerste 2000 karakters getoond]' : '');
                
              } catch (error) {
                statusDiv.innerHTML = '<div class="error">❌ Fout: ' + error.message + '</div>';
                console.error('Feed check error:', error);
              }
            }
            
            function displayValidationResults(validation, container) {
              let html = '';
              
              // Display checks
              validation.checks.forEach(function(check) {
                html += 
                  '<div class="check-item ' + (check.status === 'pass' ? 'pass' : 'fail') + '">' +
                    '<span class="check-icon">' + (check.status === 'pass' ? '✅' : '❌') + '</span>' +
                    '<div><strong>' + check.name + '</strong><br><small>' + check.message + '</small></div>' +
                  '</div>';
              });
              
              // Display improvements if any
              if (validation.improvements && validation.improvements.length > 0) {
                html += '<h3 style="margin-top: 20px; color: #856404;">💡 Aanbevolen Verbeteringen:</h3>';
                validation.improvements.forEach(function(improvement) {
                  html += 
                    '<div class="check-item" style="background: #fff3cd; color: #856404;">' +
                      '<span class="check-icon">💡</span>' +
                      '<div><small>' + improvement + '</small></div>' +
                    '</div>';
                });
              }
              
              // Display feed stats details
              if (validation.feedStats) {
                const stats = validation.feedStats;
                html += '<h3 style="margin-top: 20px;">📊 Feed Details:</h3>';
                html += 
                  '<div class="check-item pass">' +
                    '<span class="check-icon">🏷️</span>' +
                    '<div>' +
                      '<strong>Brands:</strong> ' + stats.uniqueBrands.join(', ') + '<br>' +
                      '<strong>Categorieën:</strong> ' + stats.uniqueCategories.join(', ') + '<br>' +
                      '<strong>Gemiddelde prijs:</strong> €' + stats.priceRange.avg +
                    '</div>' +
                  '</div>';
              }
              
              container.innerHTML = html;
            }
            
            function openFeedInNewTab() {
              window.open('/api/google-feed', '_blank');
            }
            
            function downloadFeed() {
              if (!feedData) {
                alert('Controleer eerst de feed door op "Feed Controleren" te klikken');
                return;
              }
              
              const blob = new Blob([feedData], { type: 'application/xml' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'google-merchant-feed-' + new Date().toISOString().split('T')[0] + '.xml';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(url);
            }
            
            // Maak functies globaal beschikbaar
            window.checkFeed = checkFeed;
            window.openFeedInNewTab = openFeedInNewTab;
            window.downloadFeed = downloadFeed;
          `
        }} />
    </>
  );
}
