using Domain.Entities;

namespace Application.Services;

public interface IToyService
{
    Task<IEnumerable<Toy>> GetAllToysAsync();
    Task AddToyAsync(Toy toy);
    Task DeleteToyAsync(int id);
    Task<Toy?> GetByIdAsync(int id);
    Task UpdateToyAsync(Toy toy);
}