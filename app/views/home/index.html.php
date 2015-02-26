
<head> 
<title>WAHC PAGE</title> 
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1"> 
</head>
<div id="container" style="margin-top:200px;">
	<div style="width:50px;height:500px;float:left"></div>
    <div >
    	<h1>WELCOME</h1>
    	<h2>Page of William</h2>
    </div>	
	<form action="control.php" method="post" id="form">
		<br> Usuario: <input type="text" name="usuario" id="usuario" />
		<br> Clave: <input type="password" name="clave" id="clave" />
		<br> <input type="submit" value="Entrar"> 
	</form> 

	<ul style="">
	  <li><a href="<?php echo getUrlFor( 'blogs' ); ?>" title="Blogs">Blogs</a></li>
	  <li><a href="<?php echo getUrlFor( 'comments' ); ?>" title="Comments">Comments</a></li>
	</ul>
</div>
<div style="width:50px;height:500px;float:left"></div>	
