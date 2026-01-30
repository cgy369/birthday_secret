package utils

// BirthStats holds population and birth rate data for estimation
type BirthRateData struct {
	TotalBirths int // 연간 총 출생아 수
}

// Data source: World Bank & UN Population Division (Approximate historical values)
// key: year, value: map of country to annual births
var historicalBirths = map[int]map[string]int{
	1950: {"Global": 92000000, "KR": 630000, "US": 3600000, "CN": 20000000, "IN": 15000000, "JP": 2300000},
	1960: {"Global": 112000000, "KR": 1000000, "US": 4200000, "CN": 25000000, "IN": 18000000, "JP": 1600000},
	1970: {"Global": 120000000, "KR": 1000000, "US": 3700000, "CN": 27000000, "IN": 22000000, "JP": 1900000},
	1980: {"Global": 125000000, "KR": 860000, "US": 3600000, "CN": 18000000, "IN": 25000000, "JP": 1500000},
	1990: {"Global": 139000000, "KR": 650000, "US": 4100000, "CN": 24000000, "IN": 28000000, "JP": 1200000},
	2000: {"Global": 131000000, "KR": 630000, "US": 4000000, "CN": 17000000, "IN": 27000000, "JP": 1100000},
	2010: {"Global": 139000000, "KR": 470000, "US": 4000000, "CN": 16000000, "IN": 27000000, "JP": 1000000},
	2020: {"Global": 134000000, "KR": 270000, "US": 3600000, "CN": 12000000, "IN": 24000000, "JP": 840000},
}

// BirthDetail holds birth counts for a specific group
type BirthDetail struct {
	Total  int `json:"total"`
	Male   int `json:"male"`
	Female int `json:"female"`
}

// EstimateDailyBirths calculates approximate number of babies born on a day in a given year
func EstimateDailyBirths(year int) map[string]BirthDetail {
	// Find the closest decade
	targetYear := (year / 10) * 10
	if targetYear < 1950 {
		targetYear = 1950
	}
	if targetYear > 2020 {
		targetYear = 2020
	}

	annualData, ok := historicalBirths[targetYear]
	if !ok {
		annualData = historicalBirths[1990]
	}

	dailyResult := make(map[string]BirthDetail)
	for country, annualTotal := range annualData {
		dailyTotal := annualTotal / 365
		// Global birth sex ratio is approximately 105 males per 100 females (51.2% male)
		male := int(float64(dailyTotal) * 0.512)
		female := dailyTotal - male

		dailyResult[country] = BirthDetail{
			Total:  dailyTotal,
			Male:   male,
			Female: female,
		}
	}

	return dailyResult
}
