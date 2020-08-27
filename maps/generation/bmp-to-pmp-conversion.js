import System;

// settings (do only change this constants)
const sBasePath : String = "C:\\Users\\david\\Desktop\\World Generation\\heightmap calculator\\";
const sProjectFolder : String = "Europe-3\\";
const sTopoFileName : String = "Topography.txt";
const sBathyFileName : String = "Bathymetry.txt";
const sResultFileName : String = "Heightmap.txt";
const sLogFileName : String = "log.txt";
const iMinHeight : ushort = 0; // 0..65535
const iMaxHeight : ushort = 16384; // 0..65535
const iHeightStepsAtShore : byte = 3; // height jump at shore (number of greyscale steps)
const skipMessages : ushort = 5000; // number of calculations for visual feedback in the console
const iBitMapHeight : ushort = 513;
const iIgnore : byte = iBitMapHeight % 4 == 0 ? 0 : ( 4 - iBitMapHeight % 4 ) * 2; // if the mapsize isn't a multiple of 4 it will be filled up with zeros (.bmp file format) - ignore these!

// other constants
const iForReading : sbyte = 1, iForWriting : sbyte = 2, iForAppending : sbyte = 8; // for the OpenAsTextStream method
const iSystemDefault : sbyte = -2, iUnicode : sbyte = -1, iASCII : sbyte = 0; // for the OpenAsTextStream method
const i2Power : uint [ ] = [ 16, 1, 4096, 256, 1048576, 65536, 268435456, 16777216 ]; // little endian hex values
const sHexDigits : char [ ] = [ "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F" ];
const iOffsetFirstChar : byte = 21; // position of data offset information in .bmp file
const iOffsetLastChar : byte = 28;

// variables
var s8BitBathy : String;
var s8BitTopo : String;
var i8BitBathy : byte;
var i8BitTopo : byte;
var i16BitHeight : ushort;
var iDigit : byte;
var fStepSize : double;
var iOceanMetricHeight : ushort = 0;
var iOceanHeight : ushort = 0;
var iStepNumber : ushort = 0;
var iBathyMin : byte = 255;
var iBathyMax : byte = 0;
var iTopoMin : byte = 255;
var iTopoMax : byte = 0;
var iCounter : uint = 0;
var iLineCounter : uint = 0;
var decBathy : byte = 0;
var decTopo : byte = 0;
var iBathyDataOffset : uint = 0;
var iTopoDataOffset : uint = 0;

// objects for file input and output
var fso : ActiveXObject = new ActiveXObject ( "Scripting.FileSystemObject" );
var fileOutputHeight = fso.GetFile ( sBasePath + sProjectFolder + sResultFileName );
var streamOutputHeight = fileOutputHeight.OpenAsTextStream ( iForWriting, iASCII );
var fileInputBathymetry = fso.GetFile ( sBasePath + sProjectFolder + sBathyFileName );
var fileInputTopography = fso.GetFile ( sBasePath + sProjectFolder + sTopoFileName );
var streamInputBathymetry; // use after initInputStreams ( )
var streamInputTopography; // use after initInputStreams ( )


/*
	Interprets the input string sHex as a hexadecimal number
	and returns the corresponding decimal number as an integer.
*/
function hexToDec ( sHex : String ) : uint
{
	var iDec : ushort = 0;
	for ( var i = 0; i < sHex.length; i++ )
	{
		for ( var j = 0; j < 16; j++ )
		{
			if ( sHex.charAt ( i ) == sHexDigits [ j ] )
			{
				iDec += j * i2Power [ i ];
				break;
			}
		}
	}
	return iDec;
}

/*
	Reads the decimal number iDec
	and returns the corresponding hexadecimal number as a string.
	iBytes are the number of bytes used to store the hex number.
*/
function decToHex ( iDec : ushort, iBytes: byte ) : String
{
	var sHex : String = "";
	var iDigit : byte = 0;
	for ( var i = ( iBytes - 1 ) * 2; i < iBytes * 2; i++ )
	{
		iDigit = Math.floor ( iDec / i2Power [ i ] );
		iDec -= i2Power [ i ] * iDigit;
		for ( var j = 0; j < 16; j++ )
		{
			if ( iDigit == j )
			{
				sHex += sHexDigits [ j ];
				break;
			}
		}
	}
	if ( iBytes == 1 ) return sHex;
	else return decToHex ( iDec, iBytes - 1 ) + sHex;
}

/*
	Repeatedly places white spaces after sString
	until its length has reached iDigits. Returns the new string.
*/
function fillString ( sString : String, iDigits : byte ) : String
{
	while ( sString.length < iDigits )
	{
		sString += " ";
	}
	return sString;
}

/*
	Initializes input streams and skips header information.
*/
function initInputStreams ( ) : void
{
	streamInputBathymetry = fileInputBathymetry.OpenAsTextStream ( iForReading, iASCII );
	streamInputTopography = fileInputTopography.OpenAsTextStream ( iForReading, iASCII );
	streamInputBathymetry.Skip ( iOffsetFirstChar - 1 );
	streamInputTopography.Skip ( iOffsetFirstChar - 1 );
	iBathyDataOffset = 2 * hexToDec ( streamInputBathymetry.Read ( iOffsetLastChar - iOffsetFirstChar + 1 ) );
	iTopoDataOffset = 2 * hexToDec ( streamInputTopography.Read ( iOffsetLastChar - iOffsetFirstChar + 1 ) );
	streamInputBathymetry.Skip ( iBathyDataOffset - iOffsetLastChar );
	streamInputTopography.Skip ( iTopoDataOffset - iOffsetLastChar );
	// debug information
	// System.Console.WriteLine ( "Bathymetry File Data Offset: " + iBathyDataOffset + " chars" );
	// System.Console.WriteLine ( "Topography File Data Offset: " + iTopoDataOffset + " chars" );
}


// do some error checking
if ( iMinHeight > iMaxHeight )
{
	iMaxHeight = iMinHeight;
	System.Console.WriteLine ( "WARNING: Invalid height limits corrected" );
}

// reset logfile
System.Console.WriteLine ( "" );
if ( fso.FileExists ( sBasePath + sLogFileName ) )
{
	fso.DeleteFile ( sBasePath + sLogFileName );
}


// calculate some boundary conditions
System.Console.WriteLine ( "Looking for min and max 8 bit grayscale values..." );
initInputStreams ( );
while ( !streamInputBathymetry.AtEndOfStream && !streamInputTopography.AtEndOfStream )
{
	iLineCounter++;
	if ( iLineCounter % ( iBitMapHeight + 1 ) == 0 )
	{
		streamInputBathymetry.Skip ( iIgnore );
		streamInputTopography.Skip ( iIgnore );
		if ( streamInputBathymetry.AtEndOfStream || streamInputTopography.AtEndOfStream )
		{
			break;
		}
		iLineCounter = 1;
	}
	
	// initialize values
	s8BitBathy = streamInputBathymetry.Read ( 2 );
	s8BitTopo = streamInputTopography.Read ( 2 );
	i8BitBathy = hexToDec ( s8BitBathy );
	i8BitTopo = hexToDec ( s8BitTopo );
	
	// check for new min and max
	if ( i8BitBathy < iBathyMin ) iBathyMin = i8BitBathy;
	if ( i8BitBathy > iBathyMax ) iBathyMax = i8BitBathy;
	if ( i8BitTopo < iTopoMin ) iTopoMin = i8BitTopo;
	if ( i8BitTopo > iTopoMax ) iTopoMax = i8BitTopo;
	
	// update progress bar
	iCounter++;
	if ( iCounter % skipMessages == 0 )
	{
		System.Console.Write ( "#" );
	}
}
System.Console.Write ( " ...Finished!" );
iStepNumber = iBathyMax - iBathyMin + iHeightStepsAtShore + iTopoMax - iTopoMin;
fStepSize = ( iMaxHeight - iMinHeight ) / iStepNumber;
iOceanHeight = Math.floor ( iMinHeight + fStepSize * ( iBathyMax - iBathyMin + iHeightStepsAtShore ) );
iOceanMetricHeight = Math.floor ( iOceanHeight / 92 );

// show some boundary conditions
System.Console.WriteLine ( "\r\n\r\nocean min grayscale:    " + fillString ( iBathyMin, 7 ) + decToHex ( iBathyMin, 1 ) );
System.Console.WriteLine ( "ocean max grayscale:    " + fillString ( iBathyMax, 7 ) + decToHex ( iBathyMax, 1 ) );
System.Console.WriteLine ( "land min grayscale:     " + fillString ( iTopoMin, 7 ) + decToHex ( iTopoMin, 1 ) );
System.Console.WriteLine ( "land max grayscale:     " + fillString ( iTopoMax, 7 ) + decToHex ( iTopoMax, 1 ) );
System.Console.WriteLine ( "height steps at shore:  " + fillString ( iHeightStepsAtShore, 7 ) + decToHex ( iHeightStepsAtShore, 1 ) );
System.Console.WriteLine ( "total number of steps:  " + fillString ( iStepNumber, 7 ) + decToHex ( iStepNumber, 2 ) );
System.Console.WriteLine ( "minimum total height:   " + fillString ( iMinHeight, 7 ) + decToHex ( iMinHeight, 2 ) );
System.Console.WriteLine ( "maximum total height:   " + fillString ( iMaxHeight, 7 ) + decToHex ( iMaxHeight, 2 ) );
System.Console.WriteLine ( "ocean height:           " + fillString ( iOceanHeight, 7 ) + decToHex ( iOceanHeight, 2 ) );
System.Console.WriteLine ( "ocean metric height:    " + fillString ( iOceanMetricHeight, 7 ) + decToHex ( iOceanMetricHeight, 2 ) );
System.Console.WriteLine ( "height step size:       " + fillString ( ushort ( fStepSize ), 7 ) + decToHex ( ushort ( fStepSize ), 2 ) );
System.Console.WriteLine ( "min precision increase: " + short ( 100 * ( 256 - fStepSize ) / fStepSize ) + "%" );

// calculate new heightmap
System.Console.WriteLine ( "\r\nCalculating 16 bit height values..." );
initInputStreams ( );
iCounter = 0;
iLineCounter = 0;
while ( !streamInputBathymetry.AtEndOfStream && !streamInputTopography.AtEndOfStream )
{
	iLineCounter++;
	if ( iLineCounter % ( iBitMapHeight + 1 ) == 0 )
	{
		streamInputBathymetry.Skip ( iIgnore );
		streamInputTopography.Skip ( iIgnore );
		if ( streamInputBathymetry.AtEndOfStream || streamInputTopography.AtEndOfStream )
		{
			break;
		}
		iLineCounter = 1;
	}
	
	// initialize values
	s8BitBathy = streamInputBathymetry.Read ( 2 );
	s8BitTopo = streamInputTopography.Read ( 2 );
	i8BitBathy = hexToDec ( s8BitBathy );
	i8BitTopo = hexToDec ( s8BitTopo );
	i16BitHeight = 0;
	
	// combine bathymetry and topography: look if bachymetry or topography is more significant
	if ( iBathyMax - i8BitBathy >= i8BitTopo - iTopoMin )
	{
		i16BitHeight = ushort ( iMinHeight + fStepSize * ( i8BitBathy - iBathyMin ) );
	}
	else // if ( iBathyMax - i8BitBathy <= i8BitTopo - iTopoMin )
	{
		i16BitHeight = ushort ( iMaxHeight - fStepSize * ( iTopoMax - i8BitTopo ) );
	}
	
	// save
	streamOutputHeight.Write ( decToHex ( i16BitHeight, 2 ) );
	
	// update progress bar
	iCounter++;
	if ( iCounter % skipMessages == 0 )
	{
		System.Console.Write ( "#" );
	}
}
System.Console.Write ( " ...Finished!" );

streamInputBathymetry.Close( );
streamInputTopography.Close( );
streamOutputHeight.Close ( );

if ( fso.FileExists ( sBasePath + sLogFileName ) )
{
	if ( fso.FileExists ( sBasePath + sProjectFolder + sLogFileName ) )
	{
		fso.DeleteFile ( sBasePath + sProjectFolder + sLogFileName );
	}
	fso.MoveFile ( sBasePath + sLogFileName, sBasePath + sProjectFolder );
}