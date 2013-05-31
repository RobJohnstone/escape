<?php

if (isset($_POST['map'])) {
	$map = json_decode($_POST['map']);
	echo "filename: maps/".$map->name.".json";
	$fp = fopen('maps/'.$map->name.'.json', 'w');
	if ($fp !== false) {
		fwrite($fp, $_POST['map']);
		fclose($fp);
	}
	else {
		echo 'failed';
	}
}

?>