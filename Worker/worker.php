<?php  

class Book {
  public $ident;
  public $tytul;
  public $liczbastron;
  public $datawydania;
}

$xml = simplexml_load_file('https://dlabystrzakow.pl/xml/produkty-dlabystrzakow.xml'); 
$books_xml = $xml->xpath('lista/ksiazka');
$books_array = new ArrayObject();

for ($i = 0; $i < count($books_xml); $i++) {
  $tmp = get_object_vars($books_xml[$i]);
  $book = new Book();
  $book->ident = $tmp["ident"];
  $book->tytul = $tmp["tytul"][0];
  $book->liczbastron = $tmp["liczbastron"];
  $book->datawydania = $tmp["datawydania"];
  $books_array->append($book);
}

$books_json = json_encode((array) $books_array);
file_put_contents('jwb-tasks/Worker/books.json', $books_json);

?>
