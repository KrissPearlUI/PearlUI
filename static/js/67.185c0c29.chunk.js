"use strict";(self.webpackChunkpearl_portal=self.webpackChunkpearl_portal||[]).push([[67],{5067:function(e,t,n){n.r(t),n.d(t,{default:function(){return A}});var o=n(2449),l=n(390),r=n(828),a=n(7142),i=n(9439),u=n(1750),d=n(8669),s=n(1442),c=n(5594),p=n(9602),f=n(6509),m=n(8817),v=n(4977),h=n(1770),g=n(304),y=n(9361),x=n(6409),C=n(1801),b=n(1413),w=n(8421),P=n(981),F=n(5771),Z=n(6649),N=n(1278),R=n(3752),S=n(6943),k=n(526),j=n(8240),O=n(2559),I=(0,o.Z)((function(e){return{autocomplete:{borderRadius:5,backgroundColor:e.palette.background.paper,"& input::placeholder":{color:e.palette.text.primary},"& .Mui-disabled":{color:e.palette.text.primary,opacity:.8}},textInput:{color:e.palette.text.primary,fontWeight:800,fontFamily:"Raleway",fontSize:10,"& .MuiIconButton-label":{color:e.palette.text.primary}},clearIndicator:{color:e.palette.text.primary}}})),T=(0,o.Z)((function(e){return{searchBox:{width:"320px",marginRight:"1em",backgroundColor:e.palette.background.paper,color:e.palette.text.primary,fontFamily:"Raleway",borderRadius:5},inputRoot:{borderRadius:5,backgroundColor:e.palette.background.paper,"&:hover .MuiOutlinedInput-notchedOutline":{borderColor:e.palette.primary.main},"& .MuiChip-root":{color:e.palette.text.primary,backgroundColor:e.palette.background.paper,borderRadius:5},"& .MuiChip-deleteIconSmall":{color:e.palette.text.primary}},option:{background:e.palette.background.paper,"&:hover":{color:e.palette.primary.main,fontWeight:400,fontFamily:"Raleway"},'&[aria-selected="true"]':{background:e.palette.background.paper,color:e.palette.primary.main,fontWeight:700,fontFamily:"Raleway"}},popupIndicator:{"&.MuiIconButton-root":{color:e.palette.text.primary}},clearIndicator:{color:e.palette.text.primary}}})),L=function(e){e.searchText;var t=e.funds,n=e.lps,o=e.selectedFundValue,l=e.selectedLPValue,r=e.searchTextValue,a=e.onValueChange,i=e.onCancelClick,u=e.onFundChange,d=e.onLPChange,s=T(),p=I();return(0,O.jsxs)(c.ZP,{container:!0,spacing:2,sx:{display:"flex",justifyContent:"space-between",flexDirection:"row",alignItems:"center",marginBottom:"0.5em",width:"100%",overflow:"hidden",paddingTop:{xs:"0.5em",md:"0.1em",lg:"0.1em"}},children:[(0,O.jsxs)(c.ZP,{container:!0,item:!0,xs:12,sm:12,md:6,lg:6,sx:{display:"flex"},children:[(0,O.jsx)(w.Z,{id:"fundAutocomplete",popupIcon:(0,O.jsx)(S.Z,{}),size:"small",autoHighlight:!0,autoSelect:!0,autoComplete:!1,classes:s,multiple:!0,sx:{marginRight:"1em",width:o&&o.length>3?"730px":"320px",marginBottom:{xs:"1em",md:o&&o.length>3?"1em":0,lg:o&&o.length>3?"1em":0}},isOptionEqualToValue:function(e,t){return e===t},onChange:function(e,t){return u(e,t)},value:null!==o&&void 0!==o?o:[],options:null!==t&&void 0!==t?t:[],getOptionLabel:function(e){return e?e.id:""},renderInput:function(e){return e.InputProps.className=p.textInput,(0,O.jsx)(P.Z,(0,b.Z)((0,b.Z)({},e),{},{className:p.autocomplete,variant:"outlined",autoComplete:"off",type:"text",style:{width:o&&o.length>3?"730px":"320px"},label:"Select a fund"}))}}),(0,O.jsx)(w.Z,{popupIcon:(0,O.jsx)(S.Z,{}),size:"small",id:"pcoAutocomplete",autoHighlight:!0,autoSelect:!0,autoComplete:!1,classes:s,multiple:!0,limitTags:5,sx:{marginRight:"1em",width:l&&l.length>2?"730px":"320px"},isOptionEqualToValue:function(e,t){return e===t},onChange:function(e,t){return d(e,t.slice(0,5))},value:null!==l&&void 0!==l?l:[],options:null!==n&&void 0!==n?n:[],getOptionLabel:function(e){return e?e.shortName:""},renderInput:function(e){return e.InputProps.className=p.textInput,(0,O.jsx)(P.Z,(0,b.Z)((0,b.Z)({},e),{},{className:p.autocomplete,variant:"outlined",autoComplete:"off",type:"text",style:{width:l&&l.length>2?"730px":"320px"},label:"Select an LP"}))}})]}),(0,O.jsxs)(c.ZP,{item:!0,xs:12,sm:12,md:6,lg:6,sx:{display:"flex",justifyContent:{xs:"flex-start",md:"flex-end",lg:"flex-end"}},children:[(0,O.jsx)(P.Z,{className:s.searchBox,variant:"outlined",size:"small",placeholder:"Search","aria-label":"search",sx:{marginRight:"0.5em"},value:r,onChange:a,InputProps:{startAdornment:(0,O.jsx)(F.Z,{position:"start",children:(0,O.jsx)(R.Z,{color:"disabled"})}),endAdornment:(0,h.Wx)(r)?null:(0,O.jsx)(F.Z,{position:"end",children:(0,O.jsx)(Z.Z,{onClick:i,children:(0,O.jsx)(N.Z,{fontSize:"small"})})})}}),(0,O.jsx)(c.ZP,{item:!0,sx:{marginRight:"0.5em"},children:(0,O.jsx)(j.Z,{pageName:"Add a PCO"})}),(0,O.jsx)(k.Z,{pageName:"lpsOverview"})]})]})},G=n(2246),W=n(5545),V=(0,o.Z)((function(){return(0,f.Z)({root:{display:"flex",flexDirection:"column",flex:1,padding:"0.2em",overflow:"hidden"},fill:{flex:1,width:"100%",height:"100%"},searchBox:{width:"40%",marginRight:"1em"},buttons:{marginLeft:5}})})),D=function(e){var t=(0,d.Z)();return(0,O.jsx)("div",{className:"ag-status-bar",role:"status",children:(0,O.jsx)("div",{className:"ag-status-bar-part ag-status-name-value",style:{fontFamily:"Raleway",color:"dark"===t.palette.mode?"white":"black",lineHeight:1.5,fontWeight:500},children:function(){var t,n=e.api,o=0;return n.forEachNode((function(e){var t;e.group||(o+=Number(null!==(t=e.data.amountInvestedLocalCcy)&&void 0!==t?t:0))})),(0,O.jsxs)("div",{children:["Invested Amount: ",(0,O.jsx)("strong",{children:(0,h.B0)(null!==(t=o)&&void 0!==t?t:0,"")})]})}()})})},E=function(){var e=V(),t=(0,a.T)(),n=(0,W.s0)(),o=(0,u.v9)((function(e){return e.app.isDarkTheme})),r=(0,u.v9)((function(e){return e.lps})).lps,f=(0,u.v9)((function(e){return e.funds})).funds,b=(0,u.v9)((function(e){return e.pcos})).pcos,w=(0,l.useState)(),P=(0,i.Z)(w,2),F=P[0],Z=P[1],N=(0,l.useState)(null),R=(0,i.Z)(N,1)[0],S=(0,d.Z)(),k=(0,l.useState)([]),j=(0,i.Z)(k,2),I=j[0],T=j[1],E=(0,l.useState)([]),B=(0,i.Z)(E,2),Q=B[0],M=B[1],A=(0,l.useState)([]),z=(0,i.Z)(A,2),H=z[0],q=z[1],_=(0,l.useState)([]),K=(0,i.Z)(_,2),U=K[0],J=K[1],X=(0,l.useState)([]),Y=(0,i.Z)(X,2),$=Y[0],ee=Y[1],te=(0,l.useState)(null),ne=(0,i.Z)(te,2),oe=ne[0],le=ne[1],re={defaultColDef:m.hf,enableCellChangeFlash:!0,enableRangeSelection:!0,animateRows:!0,pagination:!1,enableCellTextSelection:!0,groupDisplayType:"multipleColumns",sideBar:m.gh,statusBar:{statusPanels:[{statusPanel:"agTotalRowCountComponent",align:"left"},{statusPanelFramework:D}]}},ae=(0,l.useMemo)((function(){return[{headerName:"Short Name",headerTooltip:"Portfolio Company Short Name",field:"shortName",minWidth:115,enableRowGroup:!0,tooltipField:"shortName",valueGetter:function(e){var t;return null===(t=e.data)||void 0===t?void 0:t.shortName},valueSetter:function(e){return de(e,"shortName")},cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},filterParams:{buttons:["reset"]}},{headerName:"Name",headerTooltip:"Portfolio Company Name",field:"pcoName",suppressFiltersToolPanel:!0,minWidth:160,tooltipField:"pcoName",cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},filterParams:{buttons:["reset"]}},{headerName:"Headquarters",headerTooltip:"Portfolio Company Headquarters",field:"country",enableRowGroup:!0,minWidth:110,maxWidth:140,valueGetter:function(e){var t,n;return null!==(t=e.data)&&void 0!==t&&t.country?(0,s.Z)(null===(n=e.data)||void 0===n?void 0:n.country.toString()):""},valueSetter:function(e){return de(e,"country")},cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},filterParams:{buttons:["reset"]}},{headerName:"Local Currency",headerTooltip:"Portfolio Company Currency",field:"localCurrency",enableRowGroup:!0,minWidth:110,maxWidth:140,valueGetter:function(e){var t,n;return null!==(t=e.data)&&void 0!==t&&t.localCurrency?null===(n=e.data)||void 0===n?void 0:n.localCurrency.toUpperCase():""},valueSetter:function(e){return de(e,"localCurrency")},cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},filterParams:{buttons:["reset"]}},{headerName:"Invested Capital",headerTooltip:"Portfolio Company Invested Capital",field:"amountInvestedLocalCcy",enableRowGroup:!0,enableValue:!0,minWidth:220,type:"numericColumn",filter:"agNumberColumnFilter",tooltipField:"amountInvestedLocalCcy",tooltipComponentParams:{valueType:"number"},cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},valueFormatter:m.i5,valueGetter:function(e){if(e&&e.data){if(U&&U.length>0){var t,n,o=null===(t=e.data.funds)||void 0===t?void 0:t.filter((function(e){return U.some((function(t){return t.id===e.id}))}));return o&&o.length>0?o.reduce((function(e,t){var n;return e+(null!==(n=t.amountInvested)&&void 0!==n?n:0)}),0):null!==(n=e.data.amountInvestedLocalCcy)&&void 0!==n?n:0}var l;return null!==(l=e.data.amountInvestedLocalCcy)&&void 0!==l?l:0}return 0},filterParams:{buttons:["reset"]}},{headerName:"Funds",headerTooltip:"Number of Funds that invested in PCO",field:"numOfFunds",minWidth:90,maxWidth:100,enableRowGroup:!0,tooltipComponentParams:{type:"funds"},tooltipValueGetter:function(e){if(e&&e.data){if(U&&U.length>0){var t,n=null===(t=e.data.funds)||void 0===t?void 0:t.filter((function(e){return U.some((function(t){return t.id===e.id}))}));return null!==n&&void 0!==n?n:e.data.funds}return e.data.funds}return 0},valueGetter:function(e){if(e&&e.data){if(U&&U.length>0){var t,n,o=null===(t=e.data.funds)||void 0===t?void 0:t.filter((function(e){return U.some((function(t){return t.id===e.id}))}));return o&&o.length>0?o.length:null!==(n=e.data.numOfFunds)&&void 0!==n?n:0}var l;return null!==(l=e.data.numOfFunds)&&void 0!==l?l:0}return 0},cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},filterParams:m.Lt},{headerName:"LPs",headerTooltip:"Number of LPs that invested in PCO",field:"numOfLPS",minWidth:100,maxWidth:140,enableRowGroup:!0,tooltipComponentParams:{type:"lps"},cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},filterParams:m.Lt,tooltipValueGetter:function(e){if(e&&e.data){if($&&$.length>0){var t,n=null===(t=e.data.lps)||void 0===t?void 0:t.filter((function(e){return $.some((function(t){return t.id===e.id}))}));return null!==n&&void 0!==n?n:e.data.lps}return e.data.lps}return 0},valueGetter:function(e){if(e&&e.data){if($&&$.length>0){var t,n,o=null===(t=e.data.lps)||void 0===t?void 0:t.filter((function(e){return $.some((function(t){return t.id===e.id}))}));return o&&o.length>0?o.length:null!==(n=e.data.numOfLPS)&&void 0!==n?n:0}var l;return null!==(l=e.data.numOfLPS)&&void 0!==l?l:0}return 0}},{headerName:"Status",headerTooltip:"Portfolio Company Status",field:"status",valueGetter:function(e){var t;return null!==e&&void 0!==e&&null!==(t=e.data)&&void 0!==t&&t.status?(0,h.zH)(e.data.status):""},suppressFiltersToolPanel:!0,minWidth:110,maxWidth:130,enableRowGroup:!0,cellStyle:{fontFamily:"Raleway",color:S.palette.text.primary,cursor:"pointer"},filterParams:{buttons:["reset"]}}]}),[S,U,$]),ie=(0,l.useCallback)((function(e){le(e.target.value),F&&F.setQuickFilter(e.target.value)}),[F]),ue=(0,l.useCallback)((function(){le(""),F&&F.setQuickFilter("")}),[F]),de=function(e,t){var n=e.newValue,o=e.data;return o[t]!==n&&(o[t]=n,!0)},se=(0,l.useMemo)((function(){return{loadingMessage:"Loading PCOs Overview..."}}),[]);return(0,l.useEffect)((function(){t((0,y.G)()),t((0,x.E)()),t((0,C.C)())}),[t]),(0,l.useEffect)((function(){q(b)}),[b]),(0,l.useEffect)((function(){T(f)}),[f]),(0,l.useEffect)((function(){M(r)}),[r]),(0,O.jsxs)(c.ZP,{container:!0,className:e.root,children:[(0,O.jsx)(L,{searchText:R,funds:I,lps:Q,selectedFundValue:U,selectedLPValue:$,searchTextValue:oe,onValueChange:ie,onCancelClick:ue,onFundChange:function(e,t){if(e.preventDefault(),e.stopPropagation(),"focusout"!==e.nativeEvent.type){J(t);var n=b;t&&t.length>0?(n=b.filter((function(e){var n;return null===e||void 0===e||null===(n=e.funds)||void 0===n?void 0:n.some((function(e){return t.some((function(t){return t.id===e.id}))}))})),$&&$.length>0&&!oe?(n=n.filter((function(e){var t;return null===e||void 0===e||null===(t=e.lps)||void 0===t?void 0:t.some((function(e){return $.some((function(t){return t.id===e.id}))}))})),q(n)):oe&&!$?(q(n),null===F||void 0===F||F.setQuickFilter(oe)):$&&$.length>0&&oe?(n=n.filter((function(e){var t;return null===e||void 0===e||null===(t=e.lps)||void 0===t?void 0:t.some((function(e){return $.some((function(t){return t.id===e.id}))}))})),q(n),null===F||void 0===F||F.setQuickFilter(oe)):q(n)):$&&$.length>0&&!oe?(n=b.filter((function(e){var t;return null===e||void 0===e||null===(t=e.lps)||void 0===t?void 0:t.some((function(e){return $.some((function(t){return t.id===e.id}))}))})),q(n)):oe&&!$?(q(b),null===F||void 0===F||F.setQuickFilter(oe)):$&&$.length>0&&oe?(n=b.filter((function(e){var t;return null===e||void 0===e||null===(t=e.lps)||void 0===t?void 0:t.some((function(e){return $.some((function(t){return t.id===e.id}))}))})),q(n),null===F||void 0===F||F.setQuickFilter(oe)):q(b)}},onLPChange:function(e,t){if(e.preventDefault(),e.stopPropagation(),"focusout"!==e.nativeEvent.type){ee(t);var n=b;t&&t.length>0?(n=b.filter((function(e){var n;return null===e||void 0===e||null===(n=e.lps)||void 0===n?void 0:n.some((function(e){return t.some((function(t){return t.id===e.id}))}))})),U&&(null===U||void 0===U?void 0:U.length)>0&&!oe?(n=n.filter((function(e){var t;return null===e||void 0===e||null===(t=e.funds)||void 0===t?void 0:t.some((function(e){return U.some((function(t){return t.id===e.id}))}))})),q(n)):oe&&!U?(q(n),null===F||void 0===F||F.setQuickFilter(oe)):U&&(null===U||void 0===U?void 0:U.length)>0&&oe?(n=n.filter((function(e){var t;return null===e||void 0===e||null===(t=e.funds)||void 0===t?void 0:t.some((function(e){return U.some((function(t){return t.id===e.id}))}))})),q(n),null===F||void 0===F||F.setQuickFilter(oe)):q(n)):U&&(null===U||void 0===U?void 0:U.length)>0&&!oe?(n=b.filter((function(e){var t;return null===e||void 0===e||null===(t=e.funds)||void 0===t?void 0:t.some((function(e){return U.some((function(t){return t.id===e.id}))}))})),q(n)):oe&&!U?(q(b),null===F||void 0===F||F.setQuickFilter(oe)):U&&(null===U||void 0===U?void 0:U.length)>0&&oe?(n=b.filter((function(e){var t;return null===e||void 0===e||null===(t=e.funds)||void 0===t?void 0:t.some((function(e){return U.some((function(t){return t.id===e.id}))}))})),q(n),null===F||void 0===F||F.setQuickFilter(oe)):q(b)}}}),(0,O.jsx)("div",{className:(0,v.Z)((0,m.KP)(o),e.fill),style:{height:0===(null===$||void 0===$?void 0:$.length)&&0===(null===U||void 0===U?void 0:U.length)?"93%":$&&$.length>2||U&&U.length>3?"84.5%":"93%"},children:(0,O.jsx)(p.AgGridReact,{gridOptions:re,columnDefs:ae,rowData:H,onGridReady:function(e){Z(null===e||void 0===e?void 0:e.api)},loadingOverlayComponentParams:se,loadingOverlayComponent:g.Z,tooltipShowDelay:0,tooltipHideDelay:1e4,onRowClicked:function(e){var o=e.data;o&&t((0,G.E2)(o)),n("/pcosOverview/singlePCO")}})})]})},B=n(5322),Q=n(6588),M=(0,o.Z)((function(e){return{root:{display:"flex",flex:1,paddingLeft:"0.2em",paddingRight:"0.2em"}}})),A=function(){var e=M(),t=(0,a.T)();return(0,l.useEffect)((function(){t((0,r.x5)("Portfolio Companies Overview")),t((0,r.ws)("/pcosOverview"))}),[t]),(0,O.jsxs)("div",{className:e.root,children:[(0,O.jsx)(E,{}),(0,O.jsx)(B.z,{pageName:"pcosOverview",pageTitle:"Add New Portfolio Company"}),(0,O.jsx)(Q.G,{pageName:"pcosOverview",pageTitle:"Download PCOs Overview"})]})}}}]);
//# sourceMappingURL=67.185c0c29.chunk.js.map