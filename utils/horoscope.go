package utils

// GetZodiacSign returns the western zodiac sign based on month and day
func GetZodiacSign(month, day int) string {
	if (month == 3 && day >= 21) || (month == 4 && day <= 19) {
		return "양자리 (Aries)"
	} else if (month == 4 && day >= 20) || (month == 5 && day <= 20) {
		return "황소자리 (Taurus)"
	} else if (month == 5 && day >= 21) || (month == 6 && day <= 21) {
		return "쌍둥이자리 (Gemini)"
	} else if (month == 6 && day >= 22) || (month == 7 && day <= 22) {
		return "게자리 (Cancer)"
	} else if (month == 7 && day >= 23) || (month == 8 && day <= 22) {
		return "사자자리 (Leo)"
	} else if (month == 8 && day >= 23) || (month == 9 && day <= 23) {
		return "처녀자리 (Virgo)"
	} else if (month == 9 && day >= 24) || (month == 10 && day <= 22) {
		return "천칭자리 (Libra)"
	} else if (month == 10 && day >= 23) || (month == 11 && day <= 22) {
		return "전갈자리 (Scorpio)"
	} else if (month == 11 && day >= 23) || (month == 12 && day <= 24) {
		return "사수자리 (Sagittarius)"
	} else if (month == 12 && day >= 25) || (month == 1 && day <= 19) {
		return "염소자리 (Capricorn)"
	} else if (month == 1 && day >= 20) || (month == 2 && day <= 18) {
		return "물병자리 (Aquarius)"
	} else {
		return "물고기자리 (Pisces)"
	}
}
