/**
 * Test
 * Açıklama: Test için kullanlan metotları içerir, debug için kullanılır.
 */

var _veri = require('./data');

// Test metotları objesi
var testler = {};

/**
 * Veri güncelleme işlemi testi
 */
testler.güncelle = function () {
    _veri.güncelle('test', 'yeniDosya', { 'foo': 'hey' }, function (hata) {
        console.log(hata);
    });
};

/**
 * Veri dosyası oluşturma
 */
testler.oluştur = function () {
    _veri.oluştur('test', 'yeniDosya', { 'test': 'test' }, function (hata) {
        console.log(hata);
    });
};

/**
 * Dosyadan veri okuma testi
 */
testler.oku = function () {
    _veri.oku('test', 'yeniDosya', function (hata, veri) {
        console.log(hata, veri);
    });
};

/**
 * Dosyayı silme testi
 */
testler.sil = function () {
    _veri.sil('test', 'yeniDosya', function (hata) {
        console.log(hata);
    });
};

/**
 * Her testi adım adım yapma ve çıktıyı okuma
 */
testler.hepsiniTestEt = function () {
    testler.oluştur();
    testler.oku();
    testler.güncelle();
    testler.oku();
    testler.sil();
    testler.oku();
}

// Test metodlarının olduğu objeyi aktarma işlemi
module.exports = testler;