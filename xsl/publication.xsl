<?xml version="1.0" encoding="UTF-8"?>
<!--
 ===========================================================
  BarclaysDocXML to HTML
 ===========================================================
-->
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xpath-default-namespace="http://quark.com/smartcontent/3.0">
  <xsl:param name="dependenciesFolder"/>
  <xsl:param name="chapterId" />
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  <xsl:variable name="UnresolvedURICode" select="'ERROR_IN_RESOLVING_URI'"/>
  <xsl:variable name="NoAccessCode" select="'DATA_NOT_ACCESSIBLE'"/>
  
  <!-- ************** Populate variable xrefs-ids ************************ -->
  <xsl:variable name="process-xrefs" select="true()"/>
  <xsl:variable name="cdoc" select="/"/>
  <xsl:variable name="xrefs-ids">
    <xsl:if test="$process-xrefs = true()">
      <xsl:call-template name="xrefs-ids-tostring">
        <xsl:with-param name="cdoc" select="$cdoc"/>
      </xsl:call-template>
    </xsl:if>
  </xsl:variable>
  <xsl:template name="xrefs-ids-tostring">
    <xsl:param name="cdoc"/>
    <xsl:apply-templates select="$cdoc//xref[@targettype='table' or @targettype='figure' or @targettype='section']" mode="xrefs"/>
    <xsl:for-each select="$cdoc//*[@conref and not(name()='video' or name()='audio' or name()='object')]">
      <!-- referedFileNameWithID contains only file name (with or without #id part) without complete file path  -->
      <xsl:variable name="referedFileNameWithID">
        <xsl:call-template name="after-last-char">
          <xsl:with-param name="text">
            <xsl:value-of select="replace(@conref,'\\','/')"/>
          </xsl:with-param>
          <xsl:with-param name="chartext">
            <xsl:text>/</xsl:text>
          </xsl:with-param>
        </xsl:call-template>
      </xsl:variable>
      
      <xsl:variable name="cdocname">
        <xsl:choose>
          <xsl:when test="contains($referedFileNameWithID,'#')">
            <xsl:value-of select="concat('file:/', $dependenciesFolder, substring-before($referedFileNameWithID,'#'))"/>
          </xsl:when>
          <xsl:otherwise>
            <xsl:value-of select="concat('file:/', $dependenciesFolder, $referedFileNameWithID)"/>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:variable>
      
      
      <xsl:if test="$cdoc/section/@id != document($cdocname)/section/@id">
        <xsl:call-template name="xrefs-ids-tostring">
          <xsl:with-param name="cdoc" select="document($cdocname)"/>
        </xsl:call-template>
      </xsl:if>
    </xsl:for-each>
  </xsl:template>
  <xsl:template match="*" mode="xrefs">
    <xsl:variable name="refId">
      <xsl:call-template name="getElementId">
        <xsl:with-param name="text" select="@href"/>
      </xsl:call-template>
    </xsl:variable>
    <xsl:value-of select="concat($refId, '&#xA;')"/>
  </xsl:template>
  <!-- ************** Populate variable xrefs-ids ************************ -->
      
  <xsl:template name="createAnchor">
    <xsl:param name="anchorName"></xsl:param>   
    <xsl:if test="string-length($anchorName) > 0 and contains($xrefs-ids, $anchorName)">
      <xsl:element name="a">
        <xsl:attribute name="name" select="$anchorName"></xsl:attribute>
      </xsl:element>
    </xsl:if>
  </xsl:template>
  
  <xsl:template match="meta">
    <!-- Ignore all meta tags -->
  </xsl:template>
  <xsl:template match="/">
    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;
    </xsl:text>
    <xsl:element name="html">
      <xsl:attribute name="class"
        select="'js-on is-modern id--signed-out svg has-flex has-flex-wrap has-fixed'" />
      <xsl:element name="head">
        <xsl:element name="meta">
          <xsl:attribute name="http-equiv" select="'Content-Type'" />
          <xsl:attribute name="content" select="'text/html; charset=UTF-8'" />
        </xsl:element>
        <xsl:element name="meta">
          <xsl:attribute name="http-equiv" select="'X-UA-Compatible'" />
          <xsl:attribute name="content" select="'IE=edge'" />
        </xsl:element>

        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="/RSX_S/html-renderer/css/barclays-regular.css" rel="stylesheet" type="text/css"
          media="screen" />
        <!-- fetch the document title and set as html doc title -->
        <xsl:element name="title">
          <xsl:value-of select="/section/title" />
        </xsl:element>
      </xsl:element>

       <script src="/RSX_S/html-renderer/jslib/vendor.js" type="text/javascript"></script>
       <script src="/RSX_S/html-renderer/jslib/publications.js" type="text/javascript"></script>

      <xsl:element name="body">
        <article>
          <header class="content__head">
            <div class="content__header tonal__header u-cf">
              <div class="gs-container">
                <div class="content__main-column">
                  <div class="toc">
                    <xsl:copy-of select="$toc" />
                  </div>
                  <xsl:apply-templates select="descendant::section[@type='bcChapter']" mode="header" />
                </div>
              </div>
            </div>
          </header>
          <xsl:apply-templates select="descendant::section[@type='bcChapter']" />
        </article>
      </xsl:element>
    </xsl:element>
  </xsl:template>

  <xsl:template match="section" mode="header">
    <div>
      <xsl:attribute name="chapter_id">
        <xsl:value-of select="@id" />
      </xsl:attribute>
      <xsl:choose>
        <xsl:when test="($chapterId = @id) or ((not($chapterId) or $chapterId = '') and position() = 1)">
          <xsl:attribute name="class" select="'header-container is-visible visible-chapter'" />
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="class" select="'header-container is-hidden'" />
        </xsl:otherwise>
      </xsl:choose>
      <div class="content__labels">
        <div class="content__section-label">
          <xsl:apply-templates select="title/node()" />
        </div>
      </div>
      <xsl:apply-templates select="section[@type='bcHeading']/title" />
      <div class="content__standfirst notbulletted ">
        <xsl:apply-templates select="section[@type='bcHeading']/body" />
      </div>
    </div>
  </xsl:template>

    <xsl:template match="section[@type='bcChapter']">
        <div>
          <xsl:attribute name="chapter_id">
             <xsl:value-of select="@id"/>
          </xsl:attribute>
          <xsl:attribute name="class">
             <xsl:choose>
              <xsl:when test="$chapterId = @id or ((not($chapterId) or $chapterId = '') and position() = 1)">
                  <xsl:value-of select="'is-visible visible-chapter'"/>
              </xsl:when>              
               <xsl:otherwise>
                   <xsl:value-of select="'is-hidden'"/>
               </xsl:otherwise>             
             </xsl:choose>
          </xsl:attribute>          
          <div class="gs-container">
            <div class="content__main-column">
              <div class="content__article-body">
                <div class="content__meta-container">
                  <ul>
                    <li>
                      <a href="#"><img src="/RSX_S/html-renderer/svg/icn-1.svg "/></a>
                    </li>
                    <li>
                      <a href="#"><img src="/RSX_S/html-renderer/svg/icn-2.svg "/></a>
                    </li>
                    <li>
                      <a href="#"><img src="/RSX_S/html-renderer/svg/icn-3.svg "/></a>
                    </li>
                    <li>
                      <a href="#"><img src="/RSX_S/html-renderer/svg/icn-4.svg "/></a>
                    </li>
                  </ul>
                </div>
                 <xsl:apply-templates select="section[@type='bcSection']"/>
              </div>
            </div>
            <div class="content__secondary-column ">
              <div class="certifications-disclosures ">
                <div style="position:relative;">
                  <p>
                    <a class="disclosure-link" href="#">Analyst certifications and Important Disclosures</a>
                  </p>
                  <xsl:apply-templates select="//section[@type='bcDisclosure'][meta/attribute/value='frontDisclosures']" />
                  <div class="back-page-disclosure" style="display:none;position: absolute;top: 28px;background-color: #fff;border: #e4e4e4 1px solid;width: 280px;border-radius: 5px">
                    <img style="position: absolute;top: -10px;left: 20px" src="https://myqa.barcapint.com/RSR_S/nyfipubs/barcap/images/iconsUtility/talkBubbleWhite_top.png" />
                    <xsl:apply-templates select="//section[@type='bcDisclosure'][meta/attribute/value='backDisclosures']" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  </xsl:template>
  
  <xsl:template match="section[@type='bcSection']">
      <div>
        <xsl:attribute name="section_id">
          <xsl:value-of select="@id"/>
        </xsl:attribute>      
        <xsl:apply-templates select="node()"/>   
      </div>
  </xsl:template>
  
  <xsl:template match="section[@type='bcDisclosure']">
       <xsl:apply-templates select="body"/>       
  </xsl:template>

  <xsl:template  match="title[parent::section[@type='bcHeading']]">
    <h1 class="content__headline">
      <xsl:apply-templates />
    </h1>
  </xsl:template>
  
  <xsl:template match="title[parent::section[@type='bcSection' or @type='bcSub-section']]">
    <h3>
      <xsl:attribute name="toc_id">
        <xsl:value-of select="parent::section/@id"/>
      </xsl:attribute>
      <xsl:apply-templates/>
    </h3>
  </xsl:template>

    <!-- Do not process the body of section title -->
    <xsl:template match="body[parent::section[@type='creditdocument']]">

    </xsl:template>

    <xsl:template match="body">
    <xsl:apply-templates/>
  </xsl:template>
  
  <!-- Template to handle footnotes and endnotes-->
  <xsl:template match="refnote">
    <xsl:element name="span">
      <xsl:attribute name="title" select="."/>
      <!-- Check for footnote and endnote and apply class on basis of that -->
      <xsl:choose>
          <xsl:when test="@type = 'footnote'">
             <xsl:attribute name="class" select="'footnote notes'"/>             
           </xsl:when>
           <xsl:when test="@type = 'endnote'">
             <xsl:attribute name="class" select="'endnote notes'"/>
           </xsl:when>
        </xsl:choose>
    </xsl:element>  
  </xsl:template>
  <!--************* IGNORE SIDE TEXT ************* -->
  <xsl:template match="p[@type='side']">
     <!-- Ignore side text -->
  </xsl:template>   
  <!--************* IGNORE DELETED TEXT ************* -->
  <xsl:template match="node()[count(preceding-sibling::deleteStart) != count(preceding-sibling::deleteEnd)]" priority="30">
    <!-- Ignore deleted text -->
  </xsl:template>
  <xsl:template match="commentStart">
    <!-- Ignore commented text -->
  </xsl:template>
  <xsl:template match="p">
    <xsl:element name="p">
      <xsl:copy-of select="@align|@valign"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="b | i | u | sub | sup | q | cite | strike">
    <xsl:element name="{name()}">
      <xsl:copy-of select="@align|@valign"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="p[@type='lq']">
    <xsl:element name="blockquote">
      <xsl:element name="p">
        <xsl:apply-templates/>
      </xsl:element>
    </xsl:element>
  </xsl:template>
  <xsl:template match="p[@type='heading']">
    <xsl:element name="h4">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="p[@type='note']">
    <xsl:element name="p">
      <xsl:attribute name="class" select="@type"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="color">
    <xsl:element name="span">
      <xsl:attribute name="style" select="concat('color:#',@textforecolor)"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <!--  Handle tag types -->
  <xsl:template match="tag">
    <xsl:element name="span">
      <xsl:attribute name="class" select="@type"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <!-- Handle ordered and unordered lists -->
  <xsl:template match="ol | ul | li">
    <xsl:element name="{name()}">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
    <xsl:template match="t[parent::p][text() = '&#160;']">
    </xsl:template>
  <!-- ***Table Handling Start**** -->
  <xsl:template match="title[parent::table] | title[parent::img]" mode="t">
    <xsl:element name="h4">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="desc[parent::table]" mode="t">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <!-- *** Element Table **** -->
  <xsl:template match="table">
      <xsl:call-template name="createAnchor">
        <xsl:with-param name="anchorName" select="@id"/>
      </xsl:call-template>
    
            <xsl:apply-templates select="title" mode="t"/>
            <xsl:element name="table">
                <xsl:attribute name="class" select="'rt cf'"/>
                <xsl:apply-templates select="tgroup"/>
            </xsl:element>

      <xsl:apply-templates select="desc" mode="t"/>
  </xsl:template>
    <xsl:template match="thead">
        <thead class="cf">
            <xsl:apply-templates/>
        </thead>
    </xsl:template>

    <xsl:template match="tgroup | tbody">
    <xsl:element name="{name()}">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="row">
    <xsl:element name="tr">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="entry">
    <xsl:choose>
      <xsl:when test="ancestor::thead | parent::sthead">
        <th>
          <xsl:call-template name="colorcell"/>
          <xsl:call-template name="textAlign"/>
          <xsl:call-template name="spanvalue"/>
        </th>
      </xsl:when>
      <xsl:otherwise>
        <td>
          <xsl:call-template name="colorcell"/>
          <xsl:call-template name="textAlign"/>
          <xsl:call-template name="spanvalue"/>
        </td>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>

  <xsl:template name="colorcell">
    <xsl:if test="@background">
      <xsl:attribute name="bgcolor"><xsl:value-of select="concat('#',@background)"/></xsl:attribute>
    </xsl:if>
  </xsl:template>
  <xsl:template name="spanvalue">
    <xsl:if test="@morerows">
      <xsl:attribute name="rowspan"><xsl:value-of select="@morerows + 1"/></xsl:attribute>
    </xsl:if>
    <xsl:if test="@namest">
      <xsl:attribute name="colspan">
        <xsl:value-of select="ancestor-or-self::tgroup/colspec[@colname=current()/@nameend]/@colnum - ancestor-or-self::tgroup/colspec[@colname=current()/@namest]/@colnum + 1"/>
      </xsl:attribute>
    </xsl:if>
    <xsl:apply-templates/>
  </xsl:template>

  <!-- Set align attribute corresponding to align attribute for the last ancestor with align/valign value -->
  <xsl:template name="textAlign">
    <xsl:for-each select="ancestor-or-self::*[@align][last()]">
      <xsl:attribute name="align" select="@align"/>
    </xsl:for-each>
    <xsl:for-each select="ancestor-or-self::*[@valign][last()]">
      <xsl:attribute name="valign" select="./@valign"/>
    </xsl:for-each>
  </xsl:template>

  <!-- Handle Images and Figures-->
  <xsl:template match="p[@type='title'][parent::bodydiv[@type='figure']]">
    <xsl:element name="h4">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="p[@type='desc'][parent::bodydiv[@type='figure']]">
    <xsl:element name="em">
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  
  
  <xsl:template match="image">
    <xsl:if test="ancestor::bodydiv[@type='figure']">
      <xsl:call-template name="createAnchor">
        <xsl:with-param name="anchorName" select="ancestor::bodydiv/@id"/>
      </xsl:call-template>
    </xsl:if>
    <xsl:variable name="filename">
        <xsl:call-template name="after-last-char">
          <xsl:with-param name="text">
            <xsl:value-of select="replace(@href,'\\','/')"/>
          </xsl:with-param>
          <xsl:with-param name="chartext">
            <xsl:text>/</xsl:text>
          </xsl:with-param>
        </xsl:call-template>
    </xsl:variable>
    <xsl:element name="img">
      <xsl:attribute name="class" select="'img-responsive img-rounded'"/>
      <xsl:if test="@alt">
        <xsl:attribute name="alt">
          <xsl:value-of select="@alt"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:if test="@href">
        <xsl:choose>
          <xsl:when test="starts-with(@href,'http')">
            <xsl:attribute name="src" select="@href"> </xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:variable name="filename">
              <xsl:call-template name="after-last-char">
                <xsl:with-param name="text" select="replace(@href,'\\','/')"/>
                <xsl:with-param name="chartext" select="'/'"/>
              </xsl:call-template>
            </xsl:variable>
            <xsl:attribute name="src">
              <xsl:call-template name="getConvertedFileName"><xsl:with-param name="filename" select="$filename"/></xsl:call-template>
            </xsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:if>
      
      <xsl:choose>
        <!-- Specifying the width & height in style instead of having direct width 
        and height attributes as width & height attributes are obsolete in HTML5 
        and style is given preference by the rendering applications/browsers -->
        <xsl:when test="@cx and @cy and string-length(@cx) > 0 and string-length(@cy) > 0">
          <xsl:attribute name="style">
            <xsl:value-of select="concat('width:', @cx, 'px;height:', @cy, 'px')"/>
          </xsl:attribute>
        </xsl:when>
        <xsl:when test="@cx and string-length(@cx) > 0">
          <xsl:attribute name="style">
            <xsl:value-of select="concat('width:', @cx, 'px;')"/>
          </xsl:attribute>
        </xsl:when>
        <xsl:when test="@cy and string-length(@cy) > 0">
          <xsl:attribute name="style">
            <xsl:value-of select="concat('height:', @cy, 'px;')"/>
          </xsl:attribute>
        </xsl:when>
      </xsl:choose>
      <xsl:if test="@align">
        <xsl:attribute name="align">
          <xsl:value-of select="@align"/>
        </xsl:attribute>
      </xsl:if>
    </xsl:element>
  </xsl:template>
  
  <xsl:template name="getConvertedFileName">
    <xsl:param name="filename"></xsl:param>
    <xsl:value-of select="replace($filename, '.((eps)|(pdf)|(pcx)|(svg)|(tiff)|(tif)|(bmp)|(pct)|(wmf)|(sct)|(ai)|(psd))$','.jpg', 'i')" />   
  </xsl:template>
  
  <!-- Handle html hyperlinks -->
  <xsl:template match="xref[@targettype='external']">
    <xsl:element name="a">
      <xsl:attribute name="href" select="@href"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>

  <xsl:template match="xref[@targettype!='external']">
    <xsl:variable name="elmId">
      <xsl:call-template name="getElementId">
        <xsl:with-param name="text" select="@href"/>
      </xsl:call-template>
    </xsl:variable>
        
    <xsl:element name="a">
      <xsl:attribute name="href">
        <xsl:value-of select="concat('#',$elmId)"/>       
      </xsl:attribute>
      <xsl:apply-templates/>
    </xsl:element>  
  </xsl:template>
  
  <!-- Handle video title and description -->
  <xsl:template match="bodydiv[@type='video']/p[@type='title'] | bodydiv[@type='video']/p[@type='desc']" priority="10">
    <!-- Currently using same styles as that of figure title and description -->
    <xsl:element name="p">
      <xsl:attribute name="class" select="concat('fig', @type)"/>
      <xsl:apply-templates/>
    </xsl:element>
  </xsl:template>
  <xsl:template match="object[@type='video']">
    <xsl:variable name="previewfilename">
      <xsl:choose>
        <xsl:when test="@href">
          <xsl:call-template name="after-last-char">
            <xsl:with-param name="text">
              <xsl:value-of select="replace(altImage/@href,'\\','/')"/>
            </xsl:with-param>
            <xsl:with-param name="chartext">
              <xsl:text>/</xsl:text>
            </xsl:with-param>
          </xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:text>Default_Video_Preview.jpg</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="hrefValue">
      <xsl:value-of select="@href"/>
    </xsl:variable>
    <xsl:variable name="videofilename">
      <xsl:choose>
        <xsl:when test="starts-with($hrefValue, 'http:')">
          <xsl:value-of select="$hrefValue"/>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="after-last-char">
            <xsl:with-param name="text">
              <xsl:value-of select="replace($hrefValue,'\\','/')"/>
            </xsl:with-param>
            <xsl:with-param name="chartext">
              <xsl:text>/</xsl:text>
            </xsl:with-param>
          </xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:element name="div">
      <xsl:attribute name="class" select="'row'"/>
      <xsl:element name="div">
        <xsl:attribute name="class" select="'col-sm-8 col-xs-12  '"/>
        <div class="embed-responsive embed-responsive-4by3">
          <xsl:element name="video">
            <xsl:attribute name="class" select="'embed-responsive-item'"/>
            <xsl:attribute name="controls"></xsl:attribute>
            <xsl:attribute name="preload">metadata</xsl:attribute>
            <xsl:attribute name="src"><xsl:value-of select="$videofilename"></xsl:value-of></xsl:attribute>
            <xsl:attribute name="poster">
              <xsl:call-template name="getConvertedFileName"><xsl:with-param name="filename" select="$previewfilename"/></xsl:call-template>
            </xsl:attribute>
          </xsl:element>
        </div>
      </xsl:element>
      <xsl:element name="div">
        <xsl:attribute name="class" select="'col-sm-4 hidden-xs'"/>
      </xsl:element>
    </xsl:element>
  </xsl:template>
  <xsl:template match="@id">
    <xsl:attribute name="id" select="."/>
  </xsl:template>
  <xsl:template match="@type"/>
  <!-- Handle conref data -->
  <xsl:template match="*[@conref and not(name()='video' or name()='audio')]">
    <xsl:variable name="sectiondepth">
      <xsl:value-of select="count(ancestor::section)"/>
    </xsl:variable>
    <!-- referedFileNameWithID contains only file name (with or without #id part) without complete file path  -->
    <xsl:variable name="referedFileNameWithID">
      <xsl:call-template name="after-last-char">
        <xsl:with-param name="text">
          <xsl:value-of select="replace(@conref,'\\','/')"/>
        </xsl:with-param>
        <xsl:with-param name="chartext">
          <xsl:text>/</xsl:text>
        </xsl:with-param>
      </xsl:call-template>
    </xsl:variable>
    <xsl:choose>
      <xsl:when test="contains($referedFileNameWithID,'#')">
        <xsl:variable name="fileName">
          <xsl:value-of select="concat('file:', $dependenciesFolder, substring-before($referedFileNameWithID,'#'))"/>
        </xsl:variable>
        <xsl:variable name="refrencedId">
          <xsl:call-template name="getElementId">
            <xsl:with-param name="text" select="@conref"/>
          </xsl:call-template>
        </xsl:variable>
        <xsl:apply-templates select="document($fileName)//*[@id=$refrencedId]" mode="subSection">
          <xsl:with-param name="sectiondepth" select="$sectiondepth"/>
          <xsl:with-param name="anchorid" select="@id"/>
        </xsl:apply-templates>
      </xsl:when>
      <xsl:otherwise>
        <xsl:variable name="fileName">
          <xsl:value-of select="concat('file:', $dependenciesFolder, $referedFileNameWithID)"/>
        </xsl:variable>
        <xsl:apply-templates select="document($fileName)" mode="subSection">
          <xsl:with-param name="sectiondepth" select="$sectiondepth"/>
          <xsl:with-param name="anchorid" select="@id"/>
        </xsl:apply-templates>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <!--************* Apply temnplates on conref documents ************* -->
  <xsl:template match="*" mode="subSection">
    <xsl:param name="sectiondepth"/>
    <xsl:param name="anchorid"/>  
    <xsl:apply-templates select=".">
      <!-- Pass on current section's depth -->
      <xsl:with-param name="sub-sectiondepth" select="$sectiondepth"/>
      <xsl:with-param name="anchorid" select="$anchorid"/>  
    </xsl:apply-templates>
  </xsl:template>
  <xsl:template match="*[@conref][contains(@conref, $NoAccessCode)]" priority="10">
    <xsl:call-template name="noaccess"/>
  </xsl:template>
  <xsl:template match="*[@conref][contains(@conref, $UnresolvedURICode)]" priority="20">
    <xsl:call-template name="errorresolvinguri"/>
  </xsl:template>
  <xsl:template match="image[contains(@href, $NoAccessCode)]" priority="10">
    <xsl:call-template name="noaccess"/>
  </xsl:template>
  <xsl:template match="image[contains(@href, $UnresolvedURICode)]" priority="20">
    <xsl:call-template name="errorresolvinguri"/>
  </xsl:template>
  <!-- Currently showing no access or error if any of the alt image or video is inaccessible or missing   -->
  <xsl:template match="object [@type='video'] [@href[contains(., $NoAccessCode)] ]" priority="20">
    <xsl:call-template name="noaccess"/>
  </xsl:template>
  <xsl:template match="object [@type='video'] [@href[contains(., $UnresolvedURICode)] ]" priority="20">
    <xsl:call-template name="errorresolvinguri"/>
  </xsl:template>
  <xsl:template name="noaccess">
    <div style="background-color:red; color:white; margin:10px; padding:10px;">
      <xsl:element name="p">
        <xsl:attribute name="style" select="'color:white;font-size:150%'"/>
        <xsl:text>!! Referred content is not accessible !!</xsl:text>
      </xsl:element>
    </div>
  </xsl:template>
  <xsl:template name="errorresolvinguri">
    <div style="background-color:red; color:white; margin:10px; padding:10px;">
      <xsl:element name="p">
        <xsl:attribute name="style" select="'color:white;font-size:150%'"/>
        <xsl:text>!! Error resolving referred content !!</xsl:text>
      </xsl:element>
    </div>
  </xsl:template>
  
  <!-- build toc -->
  <xsl:variable name="toc">
    <a href="#">
      <img src="/RSX_S/html-renderer/svg/icn-toc.svg" />
    </a>
    <div class="toc__elements">
      <a class="toc__business-unit " href="#"><xsl:value-of select="/section[@type='bcPublication']/title" /></a>
      <a class="toc__pubtitle " href="#"><xsl:value-of select="/section[@type='bcPublication']/section[@type='bcHeading']/title" /></a>
    </div>  
    <xsl:element name="div">
      <xsl:attribute name="class" select="'toc__toc'"/>
       <xsl:for-each select="descendant::section[@type='bcChapter']">
         <xsl:choose>
            <xsl:when test="($chapterId = @id) or ((not($chapterId) or $chapterId = '') and position() = 1)">
             <xsl:apply-templates select="." mode="toc">
                <xsl:with-param name="is_Visible_Section" select="true()"/>
             </xsl:apply-templates> 
            </xsl:when>           
            <xsl:otherwise>
             <xsl:apply-templates select="." mode="toc">
                <xsl:with-param name="is_Visible_Section" select="false()"/>
              </xsl:apply-templates>            
            </xsl:otherwise>
         </xsl:choose>
      </xsl:for-each>
    </xsl:element>
  </xsl:variable>
  
  
  <xsl:template match="section" mode="toc">
    <xsl:param name="is_root" select="true()"/>
    <xsl:param name="is_Visible_Section" select="true()"/>
    <xsl:choose>
      <xsl:when test="$is_root = true()">
          <xsl:element name="ul">
            <xsl:attribute name="class" select="'nav nav-stacked fixed'"/>
            <xsl:element name="li">
              <xsl:attribute name="class" select="'sect'"/>
              <xsl:element name="a">
                <xsl:attribute name="href" select="'#'" />
                <xsl:attribute name="toc_link_id">
                  <xsl:value-of select="@id" />
                </xsl:attribute>
                <xsl:attribute name="class" select="'toc__chapter-link'"/>
                <xsl:value-of select="title/node()"/> 
              </xsl:element>
            </xsl:element>   
             <xsl:if test="@type='bcChapter'">
                <xsl:element name="li">
                  <xsl:element name="a">
                    <xsl:attribute name="href" select="'#'" />
                    <xsl:attribute name="toc_link_id">
                      <xsl:value-of select="@id" />
                    </xsl:attribute>
                    <xsl:attribute name="class" select="'toc__chapter-link'"/>
                    <xsl:value-of select="descendant::section[@type='bcHeading']/title/node()" />
                  </xsl:element>
                  <xsl:element name="ul">
                    <xsl:choose>
                      <xsl:when test="$is_Visible_Section = true()">
                         <xsl:attribute name="class" select="'nav nav-stacked active-nav-section'" />
                      </xsl:when>
                      <xsl:otherwise>
                         <xsl:attribute name="class" select="'nav nav-stacked is-hidden'" />
                      </xsl:otherwise>
                    </xsl:choose>
                    <xsl:apply-templates select="section[@type='bcSection']" mode="toc">
                      <xsl:with-param name="is_root" select="false()" />
                      <xsl:with-param name="is_Visible_Section" select="false()"/>
                    </xsl:apply-templates>
                  </xsl:element>                  
                </xsl:element>                
             </xsl:if>         
          </xsl:element>
      </xsl:when>
      <xsl:otherwise>
        <xsl:choose>
          <xsl:when test="count(section) > 0">
            <xsl:call-template name="create_toc_list_item">
              <xsl:with-param name="is_parent" select="true()"/>
            </xsl:call-template>
          </xsl:when>
          <xsl:otherwise>
            <xsl:call-template name="create_toc_list_item">
              <xsl:with-param name="is_parent" select="false()"/>
            </xsl:call-template>
          </xsl:otherwise>
        </xsl:choose>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  
  <xsl:template name="create_toc_list_item">
    <xsl:param name="is_parent" />
    <xsl:param name="is_root" />
    <xsl:element name="li">
      <xsl:element name="a">
        <xsl:attribute name="href" select="'#'" />
        <xsl:attribute name="toc_link_id">
          <xsl:value-of select="@id" />
        </xsl:attribute>
         <xsl:attribute name="class" select="'toc__section-link'" />
         <xsl:value-of select="title/node()" />
      </xsl:element>
      <xsl:if test="$is_parent = true()">
        <xsl:element name="ul">
          <xsl:attribute name="class" select="'nav nav-stacked'" />
          <xsl:apply-templates select="section[@type='bcSection']"
            mode="toc">
            <xsl:with-param name="is_root" select="false()" />
            <xsl:with-param name="is_Visible_Section" select="false()"/>
          </xsl:apply-templates>
        </xsl:element>
      </xsl:if>
    </xsl:element>
  </xsl:template>
  
  <xsl:template match="section[@conref][not( contains(@conref, $NoAccessCode) or contains(@conref, $UnresolvedURICode) )]" mode="toc">
    <xsl:param name="is_root"/>
    <xsl:variable name="fileName">
      <xsl:value-of select="concat('file:',replace(@conref,'\\','/'))"/>
    </xsl:variable>
    <xsl:apply-templates select="document($fileName)/section" mode="toc">
      <xsl:with-param name="is_root" select="$is_root"/>
    </xsl:apply-templates>
  </xsl:template>
    
  <!-- utility templates -->
  <xsl:template name="after-last-char">
    <xsl:param name="text"/>
    <xsl:param name="chartext"/>
    <xsl:choose>
      <xsl:when test="not(contains($text, $chartext))">
        <xsl:value-of select="$text"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:call-template name="after-last-char">
          <xsl:with-param name="text" select="substring-after($text, $chartext)"/>
          <xsl:with-param name="chartext" select="$chartext"/>
        </xsl:call-template>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template name="getElementId">
    <xsl:param name="text"/>
    <xsl:variable name="idPart">
      <xsl:call-template name="after-last-char">
        <xsl:with-param name="text">
          <xsl:value-of select="$text"/>
        </xsl:with-param>
        <xsl:with-param name="chartext">
          <xsl:text>#</xsl:text>
        </xsl:with-param>
      </xsl:call-template>
    </xsl:variable>
    <xsl:call-template name="after-last-char">
      <xsl:with-param name="text">
        <xsl:value-of select="$idPart"/>
      </xsl:with-param>
      <xsl:with-param name="chartext">
        <xsl:text>/</xsl:text>
      </xsl:with-param>
    </xsl:call-template>
  </xsl:template>
  
</xsl:stylesheet>
