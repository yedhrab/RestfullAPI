"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.şifreleme = şifreleme;
exports.jsonuObjeyeDönüştür = jsonuObjeyeDönüştür;
exports.rastgeleDizgiOluştur = rastgeleDizgiOluştur;
exports.twilioSMSGönder = twilioSMSGönder;

var _crypto = require("crypto");

var _yapLandRma = require("./yap\u0131land\u0131rma");

var _querystring = require("querystring");

var _https = require("https");

/**
 * Şifreleme metodu
 * @param {string} dizgi Şifrelenecek dizgi
 */
/**
 * Yardımcı metotlar
 * Açıklama: Şifreleme gibi yardımcı metodlar bulunur
 */

/**
 * Bağımlılıklar
 * * kripto; *Şifreleme metodları için*
 * * yapılandırma; *Ana program yapılandırma dosyası (şifreleme için)*
 */
function şifreleme(dizgi) {
  if (typeof dizgi === "string" && dizgi.length > 0) {
    return (0, _crypto.createHash)("sha256", _yapLandRma.şifrelemeGizliliği).update(dizgi).digest("hex");
  } else {
    return false;
  }
}

/**
 * Json'u objeye dönüştürme (parsing)
 * @param {string} dizgi Dönüştürülecek json
 * @return {object} JSON objesi
 */
function jsonuObjeyeDönüştür(dizgi) {
  try {
    var obje = JSON.parse(dizgi);
    return obje;
  } catch (e) {
    return {};
  }
}

/**
 * Rastgele bir dizgi oluşturma
 * @param {number} dizgiUzunlugu Oluşturulacak rastgele dizginin uzunluğu
 */
function rastgeleDizgiOluştur(dizgiUzunlugu) {
  dizgiUzunlugu = typeof dizgiUzunlugu == "number" && dizgiUzunlugu > 0 ? dizgiUzunlugu : false;

  if (dizgiUzunlugu) {
    // Türkçe karakter içeremez, adres çubuğuna yazılmaktadır.
    var olasıKarakterler = "abcdefghijklmnoprstuvwxyz0123456789";
    var dizgi = "";

    for (var i = 1; i <= dizgiUzunlugu; i++) {
      var rastgeleKarakter = olasıKarakterler.charAt(Math.floor(Math.random() * olasıKarakterler.length));
      dizgi += rastgeleKarakter;
    }
    return dizgi;
  } else {
    return false;
  }
}

/**
 * Twilio API üzerinden SMS gönderme
 * @param {number} telefonNo SMS gönderilecek telefon no
 * @param {string} mesaj Göderilecek SMS'in metni (içeriği)
 * @param {function(boolean | object):void} geriCagirma İşlem sırasında hata meydana gelirse true
 * * arg0: HTTP varsayılan durum kodları | Hata durumunda açıklamalar
 */
function twilioSMSGönder(telefonNo, mesaj, geriCagirma) {
  // Parametreleri kontrol ediyoruz.
  telefonNo = typeof telefonNo == "string" && telefonNo.trim().length == 10 ? telefonNo : false;

  mesaj = typeof mesaj == "string" && mesaj.trim().length > 0 && mesaj.trim().length < 1600 ? mesaj : false;

  if (telefonNo && mesaj) {
    // Yük bilgilerini yapılandırma (Türkçeleştirilemez, kaşrı sunucuya gönderilecektir.)
    var yükler = {
      From: _yapLandRma.twilio.telefon,
      To: "+90" + telefonNo,
      Body: mesaj
    };
    // Objeyi stringe çeviriyoruz
    var yükDizgisi = (0, _querystring.stringify)(yükler);

    var istekDetayları = {
      protocol: "https:",
      host: "api.twilio.com",
      method: "post",
      path: "/2010-04-01/Accounts/" + _yapLandRma.twilio.accountSid + "/Messages.json",
      auth: _yapLandRma.twilio.accountSid + ":" + _yapLandRma.twilio.authToken,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(yükDizgisi)
      }
    };

    // İsteği örneklendiriyoruz
    var istek = (0, _https.request)(istekDetayları, function (istek) {
      // Durum kodunu alıyoruz
      var durumKodu = istek.statusCode;
      // Eğer işlemler düzgün çalıştıysa geri bildirim veriyoruz
      if (durumKodu != 200 && durumKodu != 201) {
        geriCagirma("Durum kodu: " + durumKodu);
      } else {
        geriCagirma(false);
      }
    });

    // Hata durumunda isteği kesiyoruz ki hata fırlatmasın (thrown)
    istek.on("error", function (hata) {
      geriCagirma(hata);
    });

    // Yükleri yazıyoruz
    istek.write(yükDizgisi);

    // İsteği kapatıyoruz
    istek.end();
  } else {
    geriCagirma("Verilen bilgiler eksik veya kullanışsız :(");
  }
}
//# sourceMappingURL=yardımcılar.js.map