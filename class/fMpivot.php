<?
	class fMpivot {
		private $width;
		private $heightTop;
		private $heightMinimum;
		private $focus = 0;
		private $tabs = array("i","id");
		private $minimizeString;
		
		private $animationSpeed = array(
			"headerHover"	=> 500,
			"contentMove"	=> 500
		);
		private $header = array(
			"color"		=> "#808080",
			"colorHover"=> "#FF0000"
		);
		
		public function __construct($width,$heightTop,$heightMinimum,$minimizeString = true) {
			$this->width = $width;
			$this->heightTop = $heightTop;
			$this->heightMinimum = $heightMinimum;
			$this->minimizeString = $minimizeString;
		}
		
		public function setAnimationSpeed($headerHover,$contentMove = "") {
			if($headerHover != "")
				$this->animationSpeed["headerHover"] = $headerHover;
			if($contentMove != "")
				$this->animationSpeed["contentMove"] = $contentMove;
		}
		
		public function setHeaderColor($color,$colorHover = "") {
			if($color != "")
				$this->header["color"] = $color;
			if($colorHover != "")
				$this->header["colorHover"] = $colorHover;
		}
		
		public function setFocus($id) {
			if(is_int($id)) {
				if(isset($this->tabs["i"][$id])) {
					$this->focus = $id;
					return true;
				} else {
					return false;
				}
			} else {
				if(isset($this->tabs["id"][$id])) {
					$this->focus = $this->tabs["id"][$id];
					return true;
				} else {
					return false;
				}
			}
		}
		
		public function addTab($id,$title,$content0,$content1,$onclick,$X = "") {
			$this->tabs["i"][] = array(
				$id,
				$title,
				$content0,
				$content1,
				$onclick,
				$X
			);
			$this->tabs["id"][$id] = count($this->tabs["i"]) - 1;
		}
		
		public function getPivot() {
			if($this->tabsCount() > 0) {
				foreach($this->tabs["i"] AS $i => $tab) {
					unset($attr);
					
					list($id,$title,$content0,$content1,$onclick,$X) = $tab;
					
					$X["onclick"] = ($onclick === true) ? "fMpivot.gotoTab(%I%);" : $onclick;
					if($onclick != "")
						$X["class"] .= ((isset($X["class"])) ? " " : "") . "pivotClickable";
					
					if($this->focus == $i)
						$X["class"] .= ((isset($X["class"])) ? " " : "") . "pivotFocus";
					
					if($X != null) {
						foreach($X AS $a => $b) {
							$attr .= $a . '="' . $b . '" ';
						}
					}
					
					$attr = str_replace(array("%I%","%ID%"),array($i,"'" . $id . "'"),$attr);
					
					$pivotHeader .= '<span ' . $attr . 'name="pivotHeader" pivoti="' . $i . '" pivotid="' . $id . '">' . $title . '</span>';
					
					$content0 = ($content0 == "") ? "&nbsp;" : str_replace(array("%I%","%ID%"),array($i,"'" . $id . "'"),$content0);
					
					$content1 = ($content1 == "") ? "&nbsp;" : str_replace(array("%I%","%ID%"),array($i,"'" . $id . "'"),$content1);
					
					$pivotContent .= 
						'<div name="pivotContent" style="width:' . $this->width . 'px;" class="pivotContent' . (($this->focus == $i) ? '' : ' pivotHide') . '" pivoti="' . $i . '" pivotid="' . $id . '">' .
							'<div name="pivotContent0" class="pivotContent0">' . $content0 . '</div>' .
							'<div name="pivotContent1" class="pivotContent1">' . $content1 . '</div>' .
						'</div>';
				}
				
				return $this->minimize(
					'<div id="pivotHeader">' . 
						$pivotHeader . 
					'</div>' .
					'<div id="pivotContentOuter" style="width:' . $this->width . '">' .
						'<div id="pivotContent" style="width:' . ($this->tabsCount() * $this->width) . 'px;left:-' . ($this->focus * $this->width) . 'px;">' .
							$pivotContent .
						'</div>' .
					'</div>' .
					'<div class="pivotClear"></div>'
				);
			} else {
				return "false";
			}
		}
		
		public function getJavascript() {
			return $this->minimize(
				'fMpivot = new fMpivot(
					' . $this->width . ',
					' . $this->heightTop . ',
					' . $this->heightMinimum . ',
					' . $this->animationSpeed["headerHover"] . ',
					' . $this->animationSpeed["contentMove"] . ',
					"' . $this->header["color"] . '",
					"' . $this->header["colorHover"] . '"
				);fMpivot.construct();'
			,"true");
		}
		
		private function tabsCount() {
			return count($this->tabs["i"]);
		}
		
		private function minimize($string,$force = "default") {
			if($force == "default")
				$force = $this->minimizeString;
				
			return (((is_bool($force) AND $force == true) || $force == "true") ? str_replace(array("	","\r","\n"),"",$string) : $string);
		}
	};