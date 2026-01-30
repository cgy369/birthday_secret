package utils

// ZodiacResult holds the calculation results
type ZodiacResult struct {
	Year       int    `json:"year"`
	Element    string `json:"element"`     // 오행 (목, 화, 토, 금, 수)
	Animal     string `json:"animal"`      // 십이지신 (자, 축, 인, 묘...)
	Heavenly   string `json:"heavenly"`    // 천간 (갑, 을, 병, 정...)
	Earthly    string `json:"earthly"`     // 지지 (자, 축, 인...)
	Color      string `json:"color"`       // 색상 (청, 적, 황, 백, 흑)
	ZodiacName string `json:"zodiac_name"` // 예: "청룡 (갑진년)"
}

var gan = []string{"경", "신", "임", "계", "갑", "을", "병", "정", "무", "기"}
var ji = []string{"신", "유", "술", "해", "자", "축", "인", "묘", "진", "사", "오", "미"}

var elements = map[string]string{
	"갑": "목", "을": "목",
	"병": "화", "정": "화",
	"무": "토", "기": "토",
	"경": "금", "신": "금",
	"임": "수", "계": "수",
}

var colors = map[string]string{
	"목": "청",
	"화": "적",
	"토": "황",
	"금": "백",
	"수": "흑",
}

var animals = map[string]string{
	"자": "쥐", "축": "소", "인": "호랑이", "묘": "토끼",
	"진": "용", "사": "뱀", "오": "말", "미": "양",
	"신": "원숭이", "유": "닭", "술": "개", "해": "돼지",
}

// CalculateZodiac calculates the 60-zodiac information for a given year
func CalculateZodiac(year int) ZodiacResult {
	gIdx := year % 10
	jIdx := year % 12

	h := gan[gIdx]
	e := ji[jIdx]

	element := elements[h]
	color := colors[element]
	animal := animals[e]

	return ZodiacResult{
		Year:       year,
		Heavenly:   h,
		Earthly:    e,
		Element:    element,
		Animal:     animal,
		Color:      color,
		ZodiacName: color + animal + " (" + h + e + "년)",
	}
}
