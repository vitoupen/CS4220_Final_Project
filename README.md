Simply send the object id and type of search to `app.find(id, type)`
e.g. app.find(3986, "keyword");
Remember that the only types of search are :

company
keyword
movie
tv
people

This method fills the vue data object `json_object_returned_from_find_method` with the result (json object)